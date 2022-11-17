<template>
  <v-col>
    <v-card>
      <!--    <v-col>-->
      <v-card-title>
        Controls
      </v-card-title>
      <v-card-text>
        <v-row class="pa-2 center-items">
          <v-col cols="8" class="ma-0 pa-0 center-vertical">
            <p>Drag to rotate the camera</p>
          </v-col>
          <v-col cols="4" class="ma-0 pa-0 center-vertical center-horizontal">
            <img class="control-icon" :src="`${backend_url}/static/mouse_move.svg`"/>
          </v-col>
        </v-row>

        <v-row class="pa-2 center-items">
          <v-col cols="8" class="ma-0 pa-0 center-vertical">
            <p>Click the floor to move</p>
          </v-col>
          <v-col cols="4" class="ma-0 pa-0 center-vertical center-horizontal">
            <img class="control-icon" :src="`${backend_url}/static/floor_move.svg`"/>
          </v-col>
        </v-row>

        <v-row class="pa-2 center-items">
          <v-col cols="8" class="ma-0 pa-0 center-vertical">
            <p>Click an artwork to focus</p>
          </v-col>
          <v-col cols="4" class="ma-0 pa-0 center-vertical center-horizontal">
            <img class="control-icon" :src="`${backend_url}/static/artwork_focus.svg`"/>
          </v-col>
        </v-row>

        <v-row class="pa-2">
          <v-col cols="8" class="ma-0 pa-0 center-vertical">
            <p>Use the arrow keys to move</p>
          </v-col>
          <v-col cols="4" class="ma-0 pa-0 center-vertical center-horizontal">
            <img class="control-icon" :src="`${backend_url}/static/arrow_move.svg`"/>
          </v-col>
        </v-row>
      </v-card-text>
      <v-card-actions>
        <v-btn class="ma-1" small color="red" @click="$emit('close-tutorial')">Close</v-btn>
      </v-card-actions>
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
.center-vertical {
  display: flex;
  align-items: center;
}
.center-horizontal{
  display: flex;
  justify-content: center;
}

.control-icon {
  width: 80%;
}

p {
  font-size: 1.3em;
  margin-left: 1em;
}
.v-card-actions{
  display: flex;
  justify-content: right;
}
</style>