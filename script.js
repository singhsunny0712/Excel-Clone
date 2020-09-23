const $ = require("jquery");
// when the whole page is loaded
$(document).ready(function () {

    // console.log("Inside excel");
    // alert("inside excel");
    let hashmap = new Map();

    $(".grid .cell").on("click", function () {
        // element on which click event has occurred
        let ci = $(this).attr("ci")
        let ri = $(this).attr("ri")
        // console.log(text);
        //    console.log(row+" "+col);
        let row = Number(ri) + 1;
        let col = String.fromCharCode((Number(ci) + 65));
        let cellAddress = col + "" + row;
        // console.log(cellAddress);

       

        let key = $(".address-input").val();
        // console.log(key);
        let val = $(".formula").val();
        if (val != "") {
            hashmap.set(key, val);
        }
        // console.log(hashmap);
        
        $(".formula").val("");
        $("#address").val(cellAddress);

        if (hashmap.has(cellAddress)) {
            $(".formula").val(hashmap.get(cellAddress));
        }
    })

  
})