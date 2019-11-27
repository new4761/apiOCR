<template>
  <b-container class="pt-3 px-5">

    <b-card style="border-style: none;">

      <h1 class="text-center">Kmitl OCR</h1>
      <!-- {{showData}} -->
      <h5 class="text-center">เว็บสำหรับโปรเจคประจำวิชา Artificial intelligence ประจำปีการศึกษา 2019</h5>
      <p
        class="text-center text-muted"
      >****** กรุณาคลิกที่ภาพเพื่ออัพโหลดรูปภาพ (รับเฉพาะ ภาพเเนวตั้งเเละ นามสกุลไฟล์คือ png , jpg , gif) *******</p>
      <b-row no-gutters class="justify-content-center">
        <b-col md="auto" sm="12">
          <a href=" #">
            <!-- <cld-image publicId="mypic" /> -->
            <b-img
              @click="openWidget()"
              v-if="!uploadED"
              class="mx-auto"
              style="max-height:550px;"
              fluid
              src="~/assets/img/default.png"
            />
            <b-img
            fluid
              id="text-img"
              class="mx-auto"
              style="max-height:550px;"
              v-if="uploadED"
              :src="imgUrl"
            ></b-img>
            <!-- <cld-image   v-if="uploadED" publicId="mypic" /> -->
          </a>
          <!-- {{showData}}
          {{values}}-->
        </b-col>
      </b-row>
      <br />
      <h3 class="text-center text-muted" v-if="clicked">กำลังดำเนินการ!!!</h3>
      <b-progress block :value="values" :max="1" show-progress></b-progress>
      <br />
      <b-row>
        <b-col md="6" sm="12" class="mb-sm-2">
          <b-button
            variant="success"
            size="lg"
             v-if="!clicked"
            :disabled="!uploadED"
            block
            v-on:click="recognizeID"
          >สเเกนรหัสนักศึกษา</b-button>
        </b-col>
        <b-col md="6" sm="12">
          <b-button
           v-if="!clicked"
            class
            variant="info"
            size="lg"
            block
            :disabled="!uploadED"
            v-on:click="recognizeData"
          >สเเกนข้อมูลบัตรทั้งหมด</b-button>
        </b-col>
        <!-- <b-col>
          <b-button  variant="warning" size="lg" block v-on:click="recognizeID">สเเกนรหัสนักศึกษา</b-button>
        </b-col>-->
      </b-row>
    </b-card>
    <b-card v-if="uploadED&&showRaw" class="p-2">
      <h3>ข้อมูลทั้งหมดที่สเเกนได้</h3>
      <br />
      <p>{{jsonData}}</p>
    </b-card>
    <b-card v-if="uploadED&&showStd" class="p-2">
      <h3>รหัสนักศึกษา</h3>
      <br />
      <p>{{stdId}}</p>
      <!-- <nuxt-link :to="'/api/ocr/'+stdId"> -->
        <b-button pill>Get Json api</b-button>
      <!-- </nuxt-link> -->
    </b-card>
  </b-container>
</template>

<script>
/* eslint-disable */
import {
  createWorker,
  PSM,
  OEM,
  OEM_TESSERACT_LSTM_COMBINED,
  PSM_AUTO_ONLY,
  OEM_LSTM_ONLY,
  OEM_TESSERACT_ONLY,
  PSM_SINGLE_BLOCK_VERT_TEXT,
  PSM_SINGLE_LINE,
  PSM_RAW_LINE,
  PSM_AUTO_OSD,
  PSM_SPARSE_TEXT_OSD
} from "tesseract.js";
import util from "~/controller/ocr";
let getVa = 0;
const worker = createWorker({
  logger: m => {
    {
      {
        util.setValue(m.progress);
        // getVa = m.progress;
        console.log(m);
        //console.log("get"+getVa );
      }
    }
  }
});

export default {
  head: {
    script: [{ src: "https://widget.cloudinary.com/v2.0/global/all.js" }]
  },
  data: () => ({
    showRaw: false,
 clicked:false,
    showStd: false,
    uploadED: false,
    values: 0,
    jsonData: {},
    imgUrl: null,
    stdId: {},
    test: /\s\d{8}\s/
  }),
  computed: {
 showData: () => {
     return  util.data;
        }
  },

  name: "app",
  methods: {
    myCloudinary() {
      const myWidget = cloudinary.createUploadWidget(
        {
          cloudName: "new4761",
          uploadPreset: "ijr8okwl",
          sources: ["local", "url", "camera"],
          multiple: false,
          maxFiles: 1,
          clientAllowedFormats: ["png", "gif", "jpeg"]
        },
        (error, result) => {
          if (!error && result && result.event === "success") {
            console.log();
            this.uploadED = true;
            this.imgUrl = result.info.secure_url;
            // console.log(public_id);
            console.log("Done! Here is the image info: ", result.info);
          }
        }
      );
      return myWidget;
    },
    openWidget() {
      const widget = this.myCloudinary();
      widget.open();
    },
    // showData() {
    //   this.values = util.getValue();
    //   for (; false; ) {
    //     this.showData();
    //   }
    // },
    async recognizeID() {
      clicked=true;
      const img = document.getElementById("text-img");
      //console.log(img.progress);
      //
      await worker.load();
      await worker.loadLanguage("eng");
      await worker.initialize("eng", OEM_TESSERACT_LSTM_COMBINED);
      await worker.setParameters({
        tessedit_pageseg_mode: PSM_RAW_LINE
        // preserve_interword_spaces: "1"
        // tessedit_char_whitelist:'0123456789',
      });
      const {
        data: { text }
      } = await worker.recognize(img);
      console.log(text);
      this.showStd = true;
      const re = /\s\d{8}\s/;
      let Data = {};
      let find2 = {};
      if (text.match(re) === null) {
        this.jsonData = text;
        this.stdId = "ไม่เจอข้อมูล";
      } else {
        Data = text.match(re);
        const re2 = /\d{8}/;
        this.jsonData = text;
        if (Data[0].match(re2) === null) this.stdId = {};
        else {
          find2 = Data[0].match(re2);
          this.stdId = find2;
        }
      }
      // if(Data!=null)
      // this.jsonData = text;
      // else this.jsonData ={};
      console.log(Data);

      // if (Data[0].match(re2) === null) this.stdId = {};
      // else {
      //   find2 = Data[0].match(re2);
      //   this.stdId = find2;
      // }

      // if(find2!=null)
      // this.stdId = find2;
      // else this.stdId ={};
      // this.stdId = find2;
      console.log(find2);
      await this.showData();
      //.progress(progress => console.log('progress', progress))
    },
    async recognizeData() {
       clicked=true;
      const img = document.getElementById("text-img");
      //console.log(img.progress);
      //
      await worker.load();
      await worker.loadLanguage("eng");
      await worker.initialize("eng", OEM_TESSERACT_LSTM_COMBINED);
      await worker.setParameters({
        tessedit_pageseg_mode: PSM_RAW_LINE
        // preserve_interword_spaces: "1"
        // tessedit_char_whitelist:'0123456789',
      });
      const {
        data: { text }
      } = await worker.recognize(img);
      this.showRaw = true;
      console.log(text);
      this.jsonData = text;
      // const re = /\s\d{8}\s/;
      // let Data = {};
      // let find2={};
      // if (text.match(re) == null) {
      //   this.jsonData =text;
      //   this.stdId ={};

      // } else {
      //   Data = text.match(re);
      //   this.jsonData = text;
      //       if (Data[0].match(re2) === null) this.stdId = {};
      //   else {
      //     find2 = Data[0].match(re2);
      //     this.stdId = find2;
      //   }
      // }
      // // if(Data!=null)
      // // this.jsonData = text;
      // // else this.jsonData ={};
      // console.log(Data);

      // // if (Data[0].match(re2) === null) this.stdId = {};
      // // else {
      // //   find2 = Data[0].match(re2);
      // //   this.stdId = find2;
      // // }

      // // if(find2!=null)
      // // this.stdId = find2;
      // // else this.stdId ={};
      // // this.stdId = find2;
      // console.log(find2);
      await this.showData();
      //.progress(progress => console.log('progress', progress))
    }
  }
};
</script>

<style>
#app {
  font-family: "Avenir", Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
  margin-top: 60px;
}
</style>
