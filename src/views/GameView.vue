<template>
  <div class="container">
    <div class="row justify-content-center pt-5">
      <img id="car-image" src="@/assets/car.png" alt="car" style="display: none" />
      <div class="col-auto">
        <canvas ref="canvas" :width="width" :height="height" />
      </div>
    </div>
  </div>
</template>

<script lang="ts" src="./GameView.ts"></script>
