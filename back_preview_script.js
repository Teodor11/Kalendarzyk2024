//Kalendarzyk 2022
//back_script.ts
"use strict";
/////////////////////////////////////////////////////////////////////////////////////////////
function init() {
    var card_type;
    var card_elements;
    var card_type_radio_elements = Array.from(document.getElementsByName("card_type_option"));
    if (card_type_radio_elements) {
        for (var i = 0; i < card_type_radio_elements.length; i++) {
            card_type_radio_elements[i].checked = false;
            card_type_radio_elements[i].addEventListener("change", function () {
                var _a;
                (_a = changeCardType(), card_type = _a.card_type, card_elements = _a.card_elements);
            });
        }
    }
    var image_path_input = document.getElementById("card_content_image_path");
    image_path_input.addEventListener("change", function () { if (window.localStorage) {
        window.localStorage.setItem("image_path", image_path_input.value);
    } });
    if (window.localStorage) {
        var image_path = window.localStorage.getItem("image_path");
        if (image_path) {
            image_path_input.value = image_path;
        }
    }
    var clear_day_button = document.getElementById("clear_day_button");
    clear_day_button.addEventListener("click", clearDay);
    var get_card_button = document.getElementById("get_card_button");
    get_card_button.addEventListener("click", function () { getCard(card_type, card_elements); });
    var clear_card_button = document.getElementById("clear_card_button");
    clear_card_button.addEventListener("click", function () { clearCard(card_elements); });
    var copy_card_button = document.getElementById("result_copy_button");
    copy_card_button.addEventListener("click", function (e) { copyResult(e); });
}
function initDatePicker() {
    //@ts-ignore
    flatpickr("#card_content_day", {
        dateFormat: "d.m.Y",
        defaultDate: null,
        minDate: "01.01.2024",
        maxDate: "31.12.2024",
        locale: "pl"
    });
}
function clearDay() {
    var day_input = document.getElementById("card_content_day");
    day_input.value = "";
}
function clearCard(card_elements) {
    card_elements.forEach(function (el) {
        document.getElementById("card_content_" + el).value = "";
    });
    document.getElementById("card_preview").innerHTML = "";
    document.getElementById("card_result").classList.add("invisible");
}
function changeCardType() {
    var card_type_radio_el = document.querySelector("input[name=card_type_option]:checked");
    var card_type = parseInt(card_type_radio_el.value);
    var card_elements = [];
    switch (card_type) {
        case 1:
            card_elements = ["text"];
            break;
        case 2:
            card_elements = ["image_path", "image"];
            break;
        case 3:
            card_elements = ["image_path", "image", "text"];
            break;
        case 4:
            card_elements = ["image_path", "image", "text"];
            break;
        case 5:
            card_elements = ["image_path", "image", "text", "image2", "text2"];
            break;
        case 6:
            card_elements = ["image_path", "text", "image"];
            break;
        case 7:
            card_elements = ["image_path", "text", "image"];
            break;
        case 8:
            card_elements = ["image_path", "title", "image", "text"];
            break;
    }
    card_elements.unshift("day"); //add "day" at the beginning
    var card_content_field_elements = document.getElementsByClassName("card_content_field");
    if (card_content_field_elements) {
        for (var i = 0; i < card_content_field_elements.length; i++) {
            card_content_field_elements[i].classList.add("hidden");
        }
    }
    card_elements.forEach(function (el) {
        document.getElementById("card_content_field_" + el).classList.remove("hidden");
    });
    var preview_grid_el = document.getElementById("card_content_preview_grid");
    preview_grid_el.classList.remove("hidden");
    var options_elements = Array.from(document.getElementsByClassName("card_content_options_image"));
    if (options_elements) {
        for (var i = 0; i < options_elements.length; i++) {
            options_elements[i].classList.remove("hidden");
            if (card_type == 4 || card_type == 5 || card_type == 7) {
                options_elements[i].classList.add("hidden");
            }
        }
    }
    initDatePicker();
    return { card_type: card_type, card_elements: card_elements };
}
function formatText(text_in) {
    if (!text_in) {
        return "";
    }
    var t = text_in;
    // console.log("text in: ", text_in);
    if (t[0] == "\"" && t[t.length - 1] == "\"") {
        t = t.substring(1, t.length - 1);
    }
    t = t.replace(/\&/gm, "&amp;");
    //t = t.replace(/[<|\&amp\;lt\;]/gm, "&lt;");
    //t = t.replace(/[>|\&amp\;gt\;]/gm, "&gt;");
    t = t.replace(/\&amp\;nbsp\;/gm, "&nbsp;");
    t = t.replace(/</gm, "&lt;");
    t = t.replace(/>/gm, "&gt;");
    t = t.replace(/\\\*/gm, "\&ast;");
    t = t.replace(/\[standardFont\]/gm, "<span class='standardFont'>");
    t = t.replace(/\[\/standardFont\]/gm, "</span>");
    var arrayCode = [];
    var arrayResult = [];
    var regExp = /([^\\]|^)\*.*?[^\\]\*/gm;
    arrayCode = t.match(regExp);
    if (arrayCode) {
        arrayCode.forEach(function (el, index) {
            if (arrayCode[index].substring(0, 1) !== "*") {
                arrayCode[index] = arrayCode[index].substring(1);
            }
        });
        arrayResult = arrayCode.slice();
        arrayResult.forEach(function (el, index) {
            arrayResult[index] = "<span class='bold'>" + arrayCode[index].substring(1);
            arrayResult[index] = arrayResult[index].substring(0, arrayResult[index].length - 1) + "</span>";
            // console.log("array code: ", arrayCode);
            // console.log("array result: ", arrayResult);
        });
        for (var i = 0; i < arrayResult.length; i++) {
            t = t.replace(arrayCode[i], arrayResult[i]);
        }
    }
    t = t.replace(/\\;/gm, ";");
    t = t.split(/\\n/).join("<br/>");
    t = t.split(/\n/).join("<br/>");
    t = t.split(/\\t/gm).join("&Tab;");
    t = t.replace(/---/gm, "<hr/>");
    return t;
}
function formatTextResult(text_in) {
    if (!text_in) {
        return "";
    }
    var t = text_in;
    t = t.split(/<span class='bold'>/gm).join("*");
    t = t.split(/<\/span>/gm).join("*");
    t = t.split(/<br\/>/gm).join("\\n");
    t = t.split(/<hr\/>/gm).join("---");
    t = t.replace(/</gm, "&lt;");
    t = t.replace(/>/gm, "&gt;");
    t = t.replace(/\&Tab\;/gm, "\\t");
    return t;
}
function copyResult(e) {
    var copy_card_button = e.target;
    var result = document.getElementById("card_result_line").textContent;
    navigator.clipboard.writeText(result);
    var icon = copy_card_button.firstElementChild;
    icon.classList.remove("fa-copy");
    icon.classList.add("fa-check");
    copy_card_button.classList.add("result_copy_animation");
    window.setTimeout(function () {
        icon.classList.remove("fa-check");
        copy_card_button.classList.remove("result_copy_animation");
        icon.classList.add("fa-copy");
    }, 500);
}
function getCard(card_type, card_elements) {
    var path = "";
    var fields = {
        image_path: "",
        title: {},
        text: {},
        text2: {},
        image: {},
        image2: {}
    };
    card_elements.forEach(function (el) {
        switch (el) {
            case "image_path":
                path = document.getElementById("card_content_image_path").value;
                break;
            case "title":
            case "text":
            case "text2":
                fields[el].content = formatText(document.getElementById("card_content_" + el).value);
                fields[el].text_align = document.querySelector("input[name=card_content_" + el + "_align]:checked").value;
                fields[el].text_size = document.querySelector("input[name=card_content_" + el + "_size]:checked").value;
                break;
            case "image":
            case "image2":
                var temp_array = (document.getElementById("card_content_" + el).value).split("\\");
                fields[el].content = temp_array[temp_array.length - 1]; //take last element from array (only filename - remove path)
                fields[el].image_size = document.querySelector("input[name=card_content_" + el + "_size]:checked").value;
                break;
        }
    });
    console.log("fields: ", fields);
    var code = "";
    switch (card_type) {
        case 1:
            code += "<div class=\"card_back type1\">\n                <span class=\"card_back_text card_back_text_type1 ".concat(fields.text.text_align, " ").concat(fields.text.text_size, "\">").concat(fields.text.content, "</span>");
            break;
        case 2:
            code += "<div class=\"card_back type2\">\n                 <img src=\"".concat(path).concat(fields.image.content, "\" alt=\"").concat(fields.image.content, "\" class=\"card_back_image type2 ").concat(fields.image.image_size, "\" />");
            break;
        case 3:
            code += "<div class=\"card_back type3\">\n                <img src=\"".concat(path).concat(fields.image.content, "\" alt=\"").concat(fields.image.content, "\" class=\"card_back_image type3\n                ").concat(fields.image.image_size, "\" />\n                <span class=\"card_back_text ").concat(fields.text.text_align, " ").concat(fields.text.text_size, "\"> ").concat(fields.text.content, "</span>");
            break;
        case 4:
            code += "<div class=\"card_back type4\">\n                <img src=\"".concat(path).concat(fields.image.content, "\" alt=\"").concat(fields.image.content, "\" class=\"card_back_image type4\" />\n                <span class=\"card_back_text ").concat(fields.text.text_align, " ").concat(fields.text.text_size, " type4\">").concat(fields.text.content, "</span>");
            break;
        case 5:
            code += " <div class=\"card_back type5\">\n                <img src=\"".concat(path).concat(fields.image.content, "\" alt=\"").concat(fields.image.content, "\" class=\"card_back_image type5\" />\n                <span class=\"card_back_text ").concat(fields.text.text_align, " ").concat(fields.text.text_size, " type5\">").concat(fields.text.content, "</span>\n                <hr />\n                <img src=\"").concat(path).concat(fields.image2.content, "\" alt=\"").concat(fields.image2.content, "\" class=\"card_back_image type5\" />\n                <span class=\"card_back_text ").concat(fields.text2.text_align, " ").concat(fields.text2.text_size, " type5\">").concat(fields.text2.content, "</span>");
            break;
        case 6:
            code += "<div class=\"card_back type6\">\n                <span class=\"card_back_text ".concat(fields.text.text_align, " ").concat(fields.text.text_size, "\">").concat(fields.text.content, "</span>\n                <img src=\"").concat(path).concat(fields.image.content, "\" alt=\"").concat(fields.image.content, "\" class=\"card_back_image type6 ").concat(fields.image.image_size, "\" />");
            break;
        case 7:
            code += "<div class=\"card_back type7\">\n                    <span class=\"card_back_text ".concat(fields.text.text_align, " ").concat(fields.text.text_size, "\">").concat(fields.text.content, "</span>\n                    <img src=\"").concat(path).concat(fields.image.content, "\" alt=\"").concat(fields.image.content, "\" class=\"card_back_image type7\" />");
            break;
        case 8:
            code += "<div class=\"card_back type8\">\n                    <span class=\"card_back_title type8 ".concat(fields.title.text_align, " ").concat(fields.title.text_size, "\">").concat(fields.title.content, "</span>\n                    <img src=\"").concat(path).concat(fields.image.content, "\" alt=\"").concat(fields.image.content, "\" class=\"card_back_image type8 ").concat(fields.image.image_size, "\" />");
            if (fields.text.content) {
                code += "<span class=\"card_back_text ".concat(fields.text.text_align, " ").concat(fields.text.text_size, "\"> ").concat(fields.text.content, "</span> ");
            }
            break;
    }
    code += "</div>";
    var preview_container = document.getElementById("card_preview_container");
    preview_container.classList.remove("invisible");
    var preview_el = document.getElementById("card_preview");
    preview_el.innerHTML = code;
    var result_el = document.getElementById("card_result");
    result_el.classList.remove("invisible");
    getResultLine(card_type, fields);
}
function getResultLine(card_type, fields) {
    var day = document.getElementById("card_content_day").value;
    var result = "";
    // u00a0 - non-breaking space
    // u0009 - tab
    //0 - card index
    //result += ""
    // result += "\u0009"
    //1 - day
    if (day) {
        result += day;
    }
    else {
        result += "\u00a0";
    }
    result += "\u0009";
    //2 - type
    result += card_type.toString();
    //3-7 - card fields
    (["title", "text", "text2", "image", "image2"]).forEach(function (el) {
        result += "\u0009";
        result += formatTextResult(JSON.stringify(fields[el]));
    });
    var result_line_el = document.getElementById("card_result_line");
    result_line_el.textContent = result;
}
(function () { init(); })();
