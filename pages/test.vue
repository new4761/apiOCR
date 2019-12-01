<template>
  <div>
    {{data}}
    <br />
    <p id="test"></p>
    <br />
    <div class="progress">
      <div id="mytext" class="progress-bar" role="progressbar"></div>
    </div>

    <button @click="myrun()">asdads</button>
  </div>
</template>
<script>
import { eventBus } from "~/plugins/bus";
import { async } from "q";
const run = () => {

  updatetset();
};
function updatetset() {
  document.getElementById("mytext").innerHTML = eventBus.getValue();

}
export default {
  async asyncData() {
    const { testdata } = eventBus.getValue();
    return { test: testdata };
  },
  data: () => ({
    data: eventBus.getValue()
  }),
  mounted() {
    var vm = 0;
    let mainData;
    this.updatedData();
  },
  methods: {
    myrun() {
      eventBus.updateValue();
      run();
    },
    updatedData() {
      console.log();
    }
  }
};
</script>