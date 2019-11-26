const util = {
    data: 0,
    getValue() {
       // console.log("get");
       // console.log(this.data);
        return this.data        // Do something
    },
    setValue(input) {
       // console.log("SET");
        //console.log(input);

        this.data = input
        // Do something
    }
}

export default util