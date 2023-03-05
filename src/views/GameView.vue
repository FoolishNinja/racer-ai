<template>
  <div class="container">
    <img class="d-none" id="car-image" src="@/assets/car.png" alt="car" />
    <canvas class="d-none" ref="renderCanvas" :width="width" :height="height" style />
    <div class="row justify-content-center pt-5">
      <div class="col-auto">
        <canvas ref="displayCanvas" :width="width" :height="height" />
      </div>
    </div>
  </div>
</template>

<script lang="ts" src="./GameView.ts"></script>
