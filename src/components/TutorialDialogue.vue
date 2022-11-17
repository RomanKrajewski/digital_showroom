<template>
<v-col>
  <v-card>
<!--    <v-col>-->
      <v-card-title>
        Controls
      </v-card-title>
      <v-card-text>
        <v-row class="pa-2 center-items">
          <p>Drag to rotate the camera</p>
          <img class="control-icon" :src="`${backend_url}/static/mouse_move.svg`"/>
        </v-row>

        <v-row class="pa-2 center-items">
          <p>Click the floor to move</p>
          <img class="control-icon"  :src="`${backend_url}/static/floor_move.svg`"/>

        </v-row>

        <v-row class="pa-2 center-items">
          <p>Click an artwork to focus</p>
          <img class="control-icon" :src="`${backend_url}/static/artwork_focus.svg`"/>

        </v-row>

        <v-row class="pa-2">
          <v-col cols="8" class="ma-0 pa-0 center-items">
            <p >Use the arrow keys to move</p>
          </v-col>
          <v-col cols="4" class="ma-0 pa-0 center-items">
            <img class="control-icon"  :src="`${backend_url}/static/arrow_move.svg`"/>
          </v-col>
        </v-row>
      </v-card-text>
<!--    </v-col>-->
  </v-card>
</v-col>
</template>

<script>
export default {
  name: "TutorialDialogue",
  data: function () {
    return {
      backend_url: process.env.VUE_APP_BACKEND_URL,
    }
  }
}
</script>

<style scoped>
.center-items{
  display: flex;
  align-items: center;
  justify-content: center;
}
.control-icon{
  width: 7em;
}
p{
  font-size: 1.3em;
  margin-left: 1em;
}
</style>