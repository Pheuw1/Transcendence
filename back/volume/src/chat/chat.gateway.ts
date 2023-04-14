import {
  type OnGatewayConnection,
  type OnGatewayDisconnect,
  SubscribeMessage,
  WebSocketGateway,
  WebSocketServer,
  WsException,
} from '@nestjs/websockets';
import { Socket, Server } from 'socket.io';
// import { User } from 'users/user.entity';
import { UsersService } from 'src/users/users.service';
import { ChatService } from './chat.service';
import type Message from './entity/message.entity';
import * as bcrypt from 'bcrypt';
import { MessageService } from './message.service';
import { CreateMessageDto } from './dto/create-message.dto';
import { ConnectionDto } from './dto/connection.dto';
import { kickUserDto } from './dto/kickUser.dto';
import ConnectedUser from './entity/connection.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import type User from 'src/users/entity/user.entity';
import Channel from './entity/channel.entity';

@WebSocketGateway({
  cors: {
    origin: new RegExp(
      `^(http|ws)://${process.env.HOST ?? 'localhost'}(:\\d+)?$`
    ),
  },
})
export class ChatGateway implements OnGatewayConnection, OnGatewayDisconnect {
  @WebSocketServer()
  server: Server;

  constructor(
    private readonly userService: UsersService,
    private readonly messageService: MessageService,
    private readonly chatService: ChatService,
    @InjectRepository(ConnectedUser)
    private readonly connectedUserRepository: Repository<ConnectedUser>
  ) {}

  async handleConnection(socket: Socket): Promise<void> {}

  async handleDisconnect(socket: Socket): Promise<void> {
    const connect = await this.connectedUserRepository.findOneBy({
      socket: socket.id
    });
    if (connect) {
      await this.connectedUserRepository.delete({ user: connect.user })
    }
    socket.disconnect()
    console.log('socket %s has disconnected', socket.id)
  }

  @SubscribeMessage('joinChannel')
  async onJoinChannel(socket: Socket, connect: ConnectionDto): Promise<void> {
    await this.connectedUserRepository.delete({ user: connect.UserId })
    const channel = await this.chatService.getFullChannel(connect.ChannelId);
    if (channel.banned.findIndex((ban) => +ban[0] === +connect.UserId) !== -1) {
      this.server
        .to(socket.id)
        .emit('failedJoin', 'You are banned from this channel');
      throw new WsException('You are banned from this channel');
    }
    const user = await this.userService.getFullUser(connect.UserId);
    user.socketKey = '';
    if (channel.password && channel.password !== '') {
      if (
        !connect.pwd ||
        !(await bcrypt.compare(connect.pwd, channel.password))
      ) {
        this.server.to(socket.id).emit('failedJoin', 'Wrong password');
        throw new WsException('Wrong password');
      }
    }
    await this.chatService.addUserToChannel(channel, user);
    const messages = await this.messageService.findMessagesInChannelForUser(
      channel,
      user
    );
    const conUser = new ConnectedUser();
    conUser.user = user.ftId;
    conUser.channel = channel.id;
    conUser.socket = socket.id;
    const test = await this.connectedUserRepository.save(conUser);
    await socket.join(channel.id.toString());
    this.server.to(socket.id).emit('messages', messages);
  }

  @SubscribeMessage('leaveChannel')
  async onLeaveChannel(socket: Socket): Promise<void> {
    const connect = await this.connectedUserRepository.findOneBy({
      socket: socket.id,
    });
    if (connect == null) return;
    const channel = await this.chatService.getFullChannel(connect.channel);
    socket.disconnect();
    if (connect.user === channel.owner.ftId) {
      this.server.in(channel.id.toString()).disconnectSockets();
      await this.chatService.removeChannel(channel.id);
    } else {
      channel.users = channel.users.filter((e) => e.ftId !== connect.user);
    }
    await this.connectedUserRepository.delete({ socket: socket.id });
  }

  @SubscribeMessage('addMessage')
  async onAddMessage (socket: Socket, message: CreateMessageDto): Promise<void> {
    let channel: Channel | null = null
    channel = await this.chatService.getChannel(message.ChannelId).catch(() => { return null })
    if (channel == null) {
      this.server.to(socket.id).emit('kicked')
      throw new WsException('Channel has been removed by owner');
    }
    if (await this.chatService.isMuted(channel.id, message.UserId)) {
      throw new WsException('You are muted');
    }
    const createdMessage: Message = await this.messageService.createMessage(
      message
    );
    this.server.to(channel.id.toString()).emit('newMessage', createdMessage);
  }

  @SubscribeMessage('kickUser')
  async onKickUser(socket: Socket, kick: kickUserDto): Promise<void> {
    const channel = await this.chatService.getFullChannel(kick.chan);
    if (channel.owner.ftId === kick.to) {
      throw new WsException('You cannot kick the owner of a channel');
    }
    if (
      channel.owner.ftId !== kick.from &&
      channel.admins.findIndex((usr) => +usr.ftId === kick.from) === -1
    ) {
      throw new WsException('You do not have the required privileges')
    }
    const user = (await this.userService.findUser(kick.to)) as User
    const connect = (await this.connectedUserRepository.findOneBy({
      user: user.ftId
    }))
    if (connect !== null) {
      console.log(`kicking ${user.username} from ${channel.name} with socket ${connect.socket}`)
      this.server.to(connect.socket).emit('kicked')
    }
  }
}
