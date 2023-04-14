import { Injectable } from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'
import { Repository } from 'typeorm'
import { UsersService } from 'src/users/users.service'
import Result from './entity/result.entity'
import type User from 'src/users/entity/user.entity'
import { type Player } from './game/Player'
import { type PaginateQuery, paginate, type Paginated } from 'nestjs-paginate'

@Injectable()
export class PongService {
  constructor (
    @InjectRepository(Result)
    private readonly resultsRepository: Repository<Result>,
    private readonly usersService: UsersService
  ) {}

  async updateStats (
    player: User,
    nameWhoWon: string
  ): Promise<void> {
    player.matchs++
    if (player.username === nameWhoWon) player.wins++
    else player.looses++
    player.winrate = (100 * player.wins) / player.matchs
  }

  async updatePlayer (
    i: number,
    result: Result,
    nameWhoWon: string
  ): Promise<void> {
    const player: User | null = result.players[i]
    if (player == null) return
    if (result.ranked) await this.updateStats(player, nameWhoWon)
    player.results.push(result)
    player.status = 'online'
    await this.usersService.save(player)
  }

  async setInGame (playerName: string): Promise<void> {
    const player = await this.usersService.findUserByName(playerName)
    player.status = 'in-game'
    await this.usersService.save(player)
  }

  async saveResult (
    players: Player[],
    ranked: boolean,
    nameWhoWon: string
  ): Promise<void> {
    const result = new Result()
    const ply = new Array<User | null>()
    ply.push(await this.usersService.findUserByName(players[0].name))
    ply.push(await this.usersService.findUserByName(players[1].name))
    result.ranked = ranked
    result.players = ply
    result.score = [players[0].score, players[1].score]
    await this.resultsRepository.save(result)
    await this.updatePlayer(0, result, nameWhoWon)
    await this.updatePlayer(1, result, nameWhoWon)
  }

  async getHistory (
    query: PaginateQuery,
    ftId: number
  ): Promise<Paginated<Result>> {
    let queryBuilder
    if (ftId !== 0) {
      queryBuilder = this.resultsRepository
        .createQueryBuilder('result')
        .innerJoin('result.players', 'player', 'player.ftId = :ftId', { ftId })
    } else {
      queryBuilder = this.resultsRepository
        .createQueryBuilder('result')
        .where('result.ranked = :ranked', { ranked: true })
    }

    return await paginate(query, queryBuilder, {
      nullSort: 'last',
      relations: ['players'],
      defaultSortBy: [['date', 'DESC']],
      sortableColumns: ['date'],
      maxLimit: 10
    })
  }
}
