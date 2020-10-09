const $ = require("jquery");
// when the whole page is loaded
$(document).ready(function () {
    let db = [];
    // console.log("Inside excel");
    // alert("inside excel");
    $(".grid .cell").on("click", function () {
        // element on which click event has occurred
        let ci = $(this).attr("ci")
        let ri = $(this).attr("ri");
        // console.log(text);
        //    console.log(row+" "+col);
        let row = Number(ri) + 1;
        let col = String.fromCharCode((Number(ci) + 65));
        let cellAddress = col + "" + row
        $("#address").val(cellAddress);
        // check for formula or value
        let cellObj = db[ri][ci];
        if (cellObj.formula) {
            $("#formula").val(cellObj.formula);
        } else {
            $("#formula").val(cellObj.value);
        }
        // click => take value from 2d array => ui
    });
    $("#formula").on("blur", function () {
        // address bar get that cell
        let cCell = $("#address").val();
        let formula = $("#formula").val();
        // console.log(cCell);
        let { rowId, colId } = getRCFromAdd(cCell);
        // /=> go to 2d array and set formula there 
        // console.log(rowId, colId)
        let cellObj = db[rowId][colId];

        if (cellObj.formula == formula) {
            return;
        }
        if (cellObj.formula) {
            removeFormula(cellObj);
        }
        // db formula update
        cellObj.formula = formula;

        //  get value of your parents=> from formula
        setUpFormula(cellObj, cCell);
        let value = evaluate(cellObj, cCell);
        setValue(rowId, colId, value, cellObj);
    })
    $(".grid .cell").on("blur", function () {
        let ci = $(this).attr("ci")
        let ri = $(this).attr("ri");
        let cellObj = db[ri][ci];
        if ($(this).text() == cellObj.value) {
            return;
        }
        cellObj.value = $(this).text();
        // if => cellObject 
        // formula removal
        if (cellObj.formula) {
            removeFormula(cellObj);
        }

        setValue(ri, ci, cellObj.value, cellObj);
        // formula ,val set => 2dArray
    })
    // // value=> 2darray set
    function evaluate(cellObj) {
        let formula = cellObj.formula;
        // split the code
        // ( A1 + A2 )
        let fCompArr = formula.split(" ");
        // [(, A1, +, A2, )]
        // console.log(fCompArr);
        for (let i = 0; i < fCompArr.length; i++) {
            let token = fCompArr[i];
            let firstChar = fCompArr[i].charCodeAt(0);
            if (firstChar >= 65 && firstChar <= 90) {
                //cell
                let { rowId, colId } = getRCFromAdd(token);
                // console.log(rowId + " " + colId)
                let pObj = db[rowId][colId];
                let value = pObj.value;
                formula = formula.replace(token, value);
                //    add yourself to parent array 
                // pObj.children.push(cCell)
            }
            console.log(formula);
        }
        //  this function eveluate any valid js code
        // stack infix evaluation
        // (10+20+30)
        let value = eval(formula);
        return value;
    }
    function setUpFormula(cellObj, cCell) {
        let formula = cellObj.formula;
        // cycle checking
        // if (isFormulaValid(cellObj) == false) {
        //     return;
        // }
        // split the code
        // ( A1 + A2 )
        let fCompArr = formula.split(" ");
        // [(, A1, +, A2, )]
        for (let i = 0; i < fCompArr.length; i++) {
            let token = fCompArr[i];
            let firstChar = fCompArr[i].charCodeAt(0);
            if (firstChar >= 65 && firstChar <= 90) {
                //cell
                let pRC = getRCFromAdd(token);
                // console.log(rowId + " " + colId)
                let pObj = db[pRC.rowId][pRC.colId];
                //    add yourself to parent array 
                pObj.children.push(cCell);
                cellObj.parent.push(token);
            }
            console.log(formula);
        }
        //  this function eveluate any valid js code

    }
    function removeFormula(cellObj) {
        let parents = cellObj.parent;

        for (let i = 0; i < parents.length; i++) {
            let pObjRC = getRCFromAdd(parents[i]);
            let children = db[pObjRC.rowId][pObjRC.colId].children;
            let childName = $("#address").val();

            // for (let j = 0; j < children.length; j++) {
            //     if (children[i] == childName) {
            //         children.splice(i, 1);
            //         break;
            //     }
            // }
            children = children.filter(function (ch) {
                return ch != childName;
            })
            db[pObjRC.rowId][pObjRC.colId].children = children;


        }
        cellObj.parent = [];
        cellObj.formula = "";
    }
    function setValue(rowId, colId, value, cellObj) {
        $(`.grid .cell[ci=${colId}][ri=${rowId}]`).text(value);
        cellObj.value = value;
        let children = cellObj.children;
        for (let i = 0; i < children.length; i++) {
            let chObjRC = getRCFromAdd(children[i]);
            let chObj = db[chObjRC.rowId][chObjRC.colId];
            let value = evaluate(chObj, children[i]);
            // get children address
            setValue(chObjRC.rowId, chObjRC.colId, value, chObj);
            // evaluate 
            // setValue call
        }
    }
    function init() {
        let allRows = $(".grid .row");
        for (let i = 0; i < allRows.length; i++) {
            let allColOfARow = $(allRows[i]).find(".cell")
            let rowArr = [];
            for (let j = 0; j < allColOfARow.length; j++) {
                let cellObj = {
                    value: 0,
                    formula: "",
                    children: [],
                    parent: []
                }
                rowArr.push(cellObj);
            }
            db.push(rowArr);

        }

        console.log(db);

    }
    init();

    // ===========================
    $("#bold").on("click",function(){
        // console.log("inside bold function");
        let cCell = $("#address").val();
        let { rowId, colId } = getRCFromAdd(cCell);
        console.log(rowId+" "+colId);
    })
})
function getRCFromAdd(addr) {
    let colAscii = addr.charCodeAt(0);
    let colId = Number(colAscii) - 65;
    let rowId = Number(addr.substring(1)) - 1;
    return { colId, rowId }
}