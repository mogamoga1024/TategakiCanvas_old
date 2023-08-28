
(function() {
    const canvas = document.querySelector("#tategaki-canvas");
    const context = canvas.getContext("2d", { willReadFrequently: true });

    canvas.width = 600;
    canvas.height = 400;

    context.fillStyle = "#98fb98";
    context.fillRect(0, 0, canvas.width, canvas.height);

    const font = "400 60px 'ＭＳ Ｐゴシック', '游ゴシック', YuGothic, 'メイリオ', Meiryo, 'ヒラギノ角ゴ ProN W3', 'Hiragino Kaku Gothic ProN', Verdana, Roboto, 'Droid Sans', sans-serif";

    tategaki(canvas, 0, 0, font, "生きませんか？生きましょうよ。");
})();
