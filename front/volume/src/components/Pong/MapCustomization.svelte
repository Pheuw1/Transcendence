<script lang="ts">
  import { onMount } from "svelte";
  import { Point, Rect } from "./utils";
  import type { Map } from "./Map";
  import { DEFAULT_BALL_SIZE } from "./constants";
  import { Ball } from "./Ball";

  export let map: Map;

  let gameCanvas: HTMLCanvasElement;
  let context: CanvasRenderingContext2D;
  let wallWidth = 20;
  let wallHeight = 80;

  const MAX_WALLS = 5;

  onMount(() => {
    if (gameCanvas) {
      gameCanvas.width = map.size.x;
      gameCanvas.height = map.size.y;
      context = gameCanvas.getContext("2d");
      drawMap();
    }
  });

  function drawMap() {
    if (gameCanvas && context) {
      context.fillStyle = "black";
      context.fillRect(0, 0, map.size.x, map.size.y);
      for (const wall of map.walls) {
        wall.draw(context, "white");
      }
      const ball = new Ball(
        new Point(map.size.x / 2, map.size.y / 2),
        DEFAULT_BALL_SIZE
      );
      ball.draw(context, "white");
    }
  }

  function click(e: MouseEvent, rightClick: boolean) {
    if (rightClick) {
      e.preventDefault();
      removeWall(e);
    } else {
      addWall(e);
    }
    drawMap();
  }

  function addWall(e: MouseEvent) {
    const wall = new Rect(getMapXY(e), new Point(wallWidth, wallHeight));
    const ballSpawnArea = new Rect(
      new Point(map.size.x / 2, map.size.y / 2),
      new Point(DEFAULT_BALL_SIZE.x * 5, DEFAULT_BALL_SIZE.y * 5)
    );

    if (map.walls.length < MAX_WALLS && !wall.collides(ballSpawnArea))
      map.walls.push(wall);
  }

  function removeWall(e: MouseEvent) {
    const click = new Rect(getMapXY(e), new Point(1, 1));
    const index = map.walls.findIndex((w) => w.collides(click));
    if (index != -1) map.walls.splice(index, 1);
  }

  function getCanvasXY(pagePoint: Point): Point {
    const rect: any = gameCanvas.getBoundingClientRect();
    const x = pagePoint.x - rect.left;
    const y = pagePoint.y - rect.top;
    return new Point(x, y);
  }

  function getMapXY(e: MouseEvent): Point {
    const canvasPoint: Point = getCanvasXY(new Point(e.pageX, e.pageY));
    const x = (canvasPoint.x * gameCanvas.width) / gameCanvas.clientWidth;
    const y = (canvasPoint.y * gameCanvas.height) / gameCanvas.clientHeight;
    return new Point(x, y);
  }
</script>

<div>
  <div class="title">Map Customization:</div>
  <div>
    PC: Left click to add walls, right click to remove walls.
    <br />
    Mobile: Click to add walls
    <br />
    (Maximum {MAX_WALLS} walls)
  </div>
  <button
    on:click={() => {
      map.walls = [];
      drawMap();
    }}>Clear all walls</button
  >
  <br />
  <canvas
    bind:this={gameCanvas}
    on:click={(e) => click(e, false)}
    on:contextmenu={(e) => click(e, true)}
    class="renderCanvas"
  />
</div>

<style>
  .renderCanvas {
    width: 100%;
    height: 100%;
    max-width: 600px;
    max-height: 60vh;
  }

  .title {
    font-weight: bold;
  }
</style>
