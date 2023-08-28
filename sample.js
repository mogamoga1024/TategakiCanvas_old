const canvas = document.querySelector("#tategaki-canvas");
const context = canvas.getContext("2d", { willReadFrequently: true });

const font = "400 30px 'ＭＳ Ｐゴシック', '游ゴシック', YuGothic, 'メイリオ', Meiryo, 'ヒラギノ角ゴ ProN W3', 'Hiragino Kaku Gothic ProN', Verdana, Roboto, 'Droid Sans', sans-serif";

const image1 = tategaki(font, "「ああ～、");
const image2 = tategaki(font, "心がぴょんぴょん");
const image3 = tategaki(font, "するんじゃ～。」");

canvas.width = 400;
canvas.height = 400;
context.fillStyle = "#98fb98";
context.fillRect(0, 0, canvas.width, canvas.height);
context.drawImage(image1, canvas.width * 3 / 4 - image1.width / 2, 10);
context.drawImage(image2, canvas.width / 2 - image2.width / 2, canvas.height / 2 - image2.height / 2);
context.drawImage(image3, canvas.width / 4 - image3.width / 2, canvas.height - image3.height - 10);
