var back_batch;
(function (back_batch) {
    function init() {
        document.getElementById("batch_continue").addEventListener("click", getResult);
        document.getElementById("batch_hide").addEventListener("click", hideElements);
    }
    function getResult() {
        let first_data = document.getElementById("batch_data").value;
        let data_array = first_data.split(/\n/gm);
        first_data = null;
        let data = [];
        data_array.forEach((el, i) => {
            const el_array = el.split(/\t/gm);
            data[i] = {};
            data[i].index = el_array[0];
            data[i].day = el_array[1];
            data[i].type = parseInt(el_array[2]);
            data[i].title = JSON.parse(el_array[3]);
            data[i].text = JSON.parse(el_array[4]);
            data[i].text2 = JSON.parse(el_array[5]);
            data[i].image = JSON.parse(el_array[6]);
            data[i].image2 = JSON.parse(el_array[7]);
            const elements = ["title", "text", "text2", "image", "image2"];
            for (let j = 0; j < elements.length; j++) {
                const el = data[i][elements[j]];
                el.content = formatText(el.content);
            }
        });
        console.log("data:");
        console.log(data);
        console.log(JSON.stringify(data));
        createCards(data);
    }
    function createCards(data) {
        const result_el = document.getElementById("batch_result");
        result_el.innerHTML = "";
        let code;
        let path = document.getElementById("batch_image_path").value;
        let days_array = [];
        let data_html_array = [];
        data.forEach(el => {
            code = "";
            switch (el.type) {
                case 1:
                    code += `<div class="card_back type1">
                <span class="card_back_text card_back_text_type1 ${el.text.text_align} ${el.text.text_size}">${el.text.content}</span>`;
                    break;
                case 2:
                    code += `<div class="card_back type2">
                 <img src="${path}${el.image.content}" alt="${el.image.content}" class="card_back_image type2 ${el.image.image_size}" />`;
                    break;
                case 3:
                    code += `<div class="card_back type3">
                <img src="${path}${el.image.content}" alt="${el.image.content}" class="card_back_image type3
                ${el.image.image_size}" />
                <span class="card_back_text ${el.text.text_align} ${el.text.text_size}"> ${el.text.content}</span>`;
                    break;
                case 4:
                    code += `<div class="card_back type4">
                <img src="${path}${el.image.content}" alt="${el.image.content}" class="card_back_image type4" />
                <span class="card_back_text ${el.text.text_align} ${el.text.text_size} type4">${el.text.content}</span>`;
                    break;
                case 5:
                    code += ` <div class="card_back type5">
                <img src="${path}${el.image.content}" alt="${el.image.content}" class="card_back_image type5" />
                <span class="card_back_text ${el.text.text_align} ${el.text.text_size} type5">${el.text.content}</span>
                <hr />
                <img src="${path}${el.image2.content}" alt="${el.image2.content}" class="card_back_image type5" />
                <span class="card_back_text ${el.text2.text_align} ${el.text2.text_size} type5">${el.text2.content}</span>`;
                    break;
                case 6:
                    code += `<div class="card_back type6">
                <span class="card_back_text ${el.text.text_align} ${el.text.text_size}">${el.text.content}</span>
                <img src="${path}${el.image.content}" alt="${el.image.content}" class="card_back_image type6 ${el.image.image_size}" />`;
                    break;
                case 7:
                    code += `<div class="card_back type7">
                    <span class="card_back_text ${el.text.text_align} ${el.text.text_size}">${el.text.content}</span>
                    <img src="${path}${el.image.content}" alt="${el.image.content}" class="card_back_image type7" />`;
                    break;
                case 8:
                    code += `<div class="card_back type8">
                    <span class="card_back_title type8 ${el.title.text_align} ${el.title.text_size}">${el.title.content}</span>
                    <img src="${path}${el.image.content}" alt="${el.image.content}" class="card_back_image type8 ${el.image.image_size}" />`;
                    if (el.text.content) {
                        code += `<span class="card_back_text ${el.text.text_align} ${el.text.text_size}"> ${el.text.content}</span> `;
                    }
                    break;
            }
            code += "</div>";
            days_array.push(el.day);
            data_html_array.push(code);
            result_el.innerHTML += code;
        });
    }
    function formatText(text_in) {
        if (!text_in) {
            return "";
        }
        let t = text_in;
        t = t.replace(/\&lt\;/gm, "<");
        t = t.replace(/\&gt\;/gm, ">");
        t = t.replace(/\&/gm, "&amp;");
        t = t.replace(/</gm, "&lt;");
        t = t.replace(/>/gm, "&gt;");
        t = t.replace(/\\;/gm, ";");
        t = t.split(/\\n/).join("<br/>");
        t = t.split(/\n/).join("<br/>");
        t = t.replace(/---/gm, "<hr/>");
        if (t[0] == `"` && t[t.length - 1] == `"`) {
            t = t.substring(1, t.length - 1);
        }
        t = t.replace(/\&amp\;nbsp\;/gm, "&nbsp;");
        t = t.replace(/\&amp;ast;/gm, "&ast;");
        t = t.replace(/\\\*/gm, "&ast;");
        t = t.replace(/\[standardFont\]/gm, "<span class='standardFont'>");
        t = t.replace(/\[\/standardFont\]/gm, "</span>");
        let arrayCode = [];
        let arrayResult = [];
        let regExp = /([^\\]|^)\*.*?[^\\]\*/gm;
        arrayCode = t.match(regExp);
        if (arrayCode) {
            arrayCode.forEach((_, index) => {
                if (arrayCode[index].substring(0, 1) !== "*") {
                    arrayCode[index] = arrayCode[index].substring(1);
                }
            });
            arrayResult = arrayCode.slice();
            arrayResult.forEach((_, index) => {
                arrayResult[index] = "<span class='bold'>" + arrayCode[index].substring(1);
                arrayResult[index] = arrayResult[index].substring(0, arrayResult[index].length - 1) + "</span>";
            });
            for (let i = 0; i < arrayResult.length; i++) {
                t = t.replace(arrayCode[i], arrayResult[i]);
            }
        }
        return t;
    }
    function hideElements() {
        const elements_to_hide = document.getElementsByClassName("to_hide");
        if (elements_to_hide) {
            for (let i = 0; i < elements_to_hide.length; i++) {
                elements_to_hide[i].classList.add("hidden");
            }
        }
        document.body.classList.add("batch_saving");
        document.body.style.opacity = "0.9";
        document.getElementById("batch_result").classList.add("batch_saving");
        const cards = document.getElementsByClassName("card_back");
        if (cards) {
            for (let i = 0; i < cards.length; i++) {
                cards[i].classList.add("batch_saving");
            }
        }
    }
    (function () { init(); })();
})(back_batch || (back_batch = {}));
