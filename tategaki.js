
function tategaki(canvas, x, y, font, text) {
    const tmpCanvas = document.createElement("canvas");
    const tmpContext = tmpCanvas.getContext("2d", { willReadFrequently: true });
    
    const smallCharList = "、。っゃゅょぁぃぅぇぉッャュョァィゥェォ「」()（）【】";
    const rotateCharList = "「」()（）【】ー ～…";
    const reverseCharList = "ー～";
    const centerJustifiedCharList = "()（）【】…";
    const leftJustifiedCharList = "」";

    let minCanvasHeight = 0;
    const {
        width: standardCharWidth,
        height: standardCharHeight
    } = (() => {
        tmpContext.font = font;
        tmpContext.textBaseline = "top";
        tmpContext.textAlign = "center";
        const measure = tmpContext.measureText("あ")
        tmpCanvas.width = Math.ceil(measure.width);
        minCanvasHeight = Math.ceil(Math.abs(measure.actualBoundingBoxAscent) + measure.actualBoundingBoxDescent);
        tmpCanvas.height = minCanvasHeight;

        tmpContext.font = font;
        tmpContext.fillStyle = "#fff";
        tmpContext.fillRect(0, 0, tmpCanvas.width, tmpCanvas.height);
        tmpContext.fillStyle = "#000";
        tmpContext.textBaseline = "top";
        tmpContext.textAlign = "center";
        tmpContext.fillText("あ", tmpCanvas.width / 2, 0);
        const tmpPixels = tmpContext.getImageData(0, 0, tmpCanvas.width, tmpCanvas.height)
        return CanvasUtils.trimming(tmpPixels);
    })();

    // 各文字の幅、高さの抽出とか
    let tmpCanvasWidth = 0;
    let tmpCanvasHeight = 0;
    const charList = [];
    for (const char of text) {
        tmpContext.font = font;
        tmpContext.textBaseline = "top";
        tmpContext.textAlign = "center";
        const measure = tmpContext.measureText(char);
        const width = measure.width;
        const height = Math.abs(measure.actualBoundingBoxAscent) + measure.actualBoundingBoxDescent;
        let canvasWidth = width;
        let canvasHeight = height;

        if (rotateCharList.includes(char)) {
            canvasWidth = height;
            canvasHeight = width;
        }

        charList.push({
            value: char,
            width: width,
            height: height,
            canvasWidth: canvasWidth,
            canvasHeight: canvasHeight,
        });
        if (tmpCanvasWidth < canvasWidth) {
            tmpCanvasWidth = canvasWidth;
        }
        tmpCanvasHeight += Math.max(canvasHeight, standardCharHeight);
    }

    tmpCanvas.width = Math.ceil(tmpCanvasWidth);
    tmpCanvas.height = Math.ceil(tmpCanvasHeight) + tateMargin * (charList.length - 1);
    tmpContext.fillStyle = "#fff";
    tmpContext.fillRect(0, 0, tmpCanvas.width, tmpCanvas.height);

    let dstY = 0;
    let maxWidth = standardCharWidth;
    let totalHeight = tateMargin * (charList.length - 1);
    for (const char of charList) {
        const isSmallChar = smallCharList.includes(char.value);
        const isRotateCar = rotateCharList.includes(char.value);
        const isReverseChar = reverseCharList.includes(char.value);
        const isCenterJustifiedChar = centerJustifiedCharList.includes(char.value); 
        const isLeftJustifiedChar = leftJustifiedCharList.includes(char.value);

        this.#canvas.width = Math.ceil(char.canvasWidth);
        this.#canvas.height = Math.max(Math.ceil(char.canvasHeight), minCanvasHeight);

        if (isRotateCar) {
            this.#canvas.width = this.#canvas.height = Math.max(this.#canvas.width, this.#canvas.height);
        }

        // テキスト反映
        this.#context.font = font;
        this.#context.fillStyle = "#fff";
        this.#context.fillRect(0, 0, this.#canvas.width, this.#canvas.height);
        this.#context.fillStyle = "#000";
        this.#context.textBaseline = "middle";
        this.#context.textAlign = "center";

        if (isRotateCar) {
            this.#context.translate(this.#canvas.width / 2, this.#canvas.height / 2);
            this.#context.rotate(Math.PI / 2);
            this.#context.translate(-this.#canvas.width / 2, -this.#canvas.height / 2);
        }
        if (isReverseChar) {
            this.#context.scale(1, -1);
            this.#context.translate(0, -this.#canvas.height);
        }

        this.#context.fillText(char.value, this.#canvas.width / 2, this.#canvas.height / 2);
        // トリミング
        const trimmed = CanvasUtils.trimming(this.pixels);

        // 転写
        let dstX = (tmpCanvas.width - trimmed.width) / 2;

        if (isSmallChar && !isCenterJustifiedChar) {
            // 右寄せ
            dstX = (tmpCanvas.width - standardCharWidth) / 2 + standardCharWidth - trimmed.width;
        }
        if (isLeftJustifiedChar) {
            // 左寄せ
            dstX = (tmpCanvas.width - standardCharWidth) / 2;
        }
        
        // 漢数字の「一」みたいな文字は必要な余白すら切り取られてしまうので対策
        let isLargeMarginChar = !isSmallChar && trimmed.height < standardCharHeight;
        const prevDestY = dstY;
        if (isLargeMarginChar) {
            dstY += (standardCharHeight - trimmed.height) / 2;
        }

        tmpContext.putImageData(this.#context.getImageData(trimmed.x, trimmed.y, trimmed.width, trimmed.height), dstX, dstY);

        if (isLargeMarginChar) {
            dstY = prevDestY;
            dstY += standardCharHeight + tateMargin;
            totalHeight += standardCharHeight;
        }
        else {
            dstY += trimmed.height + tateMargin;
            totalHeight += trimmed.height;
        }

        if (maxWidth < trimmed.width) {
            maxWidth = trimmed.width;
        }
    }

    const tmpCanvas2 = document.createElement("canvas");
    const tmpContext2 = tmpCanvas2.getContext("2d", { willReadFrequently: true });
    let yokoMargin = 0;
    tmpCanvas2.width = maxWidth + yokoMargin * 2;
    tmpCanvas2.height = totalHeight + tateMargin * 2;
    tmpContext2.fillStyle = "#fff";
    tmpContext2.fillRect(0, 0, tmpCanvas2.width, tmpCanvas2.height);
    const dstX = (tmpCanvas2.width - tmpCanvas.width) / 2;
    tmpContext2.drawImage(tmpCanvas, dstX, tateMargin);

    const context = canvas.getContext("2d", { willReadFrequently: true });
    const rate = yokoPixelCount / tmpCanvas2.width;
    context.drawImage(tmpCanvas2, x, y, yokoPixelCount, tmpCanvas2.height * rate);
}

trimming(pixels) {
    const data = pixels.data;
    let targetLeftX = -1;
    let targetRightX = -1;
    let targetTopY = -1;
    let targetBottomY = -1;

    // left-xを求める
    for (let col = 0; col < pixels.width; col++) {
        for (let row = 0; row < pixels.height; row++) {
            const i = row * pixels.width * 4 + col * 4;
            if (data[i] !== 255) {
                targetLeftX = col;
                break;
            }
        }
        if (targetLeftX !== -1) {
            break;
        }
    }

    if (targetLeftX === -1) {
        throw new Error("文字がない！！真っ白！！");
    }

    // right-xを求める
    for (let col = pixels.width - 1; col >= 0; col--) {
        for (let row = 0; row < pixels.height; row++) {
            const i = row * pixels.width * 4 + col * 4;
            if (data[i] !== 255) {
                targetRightX = col;
                break;
            }
        }
        if (targetRightX !== -1) {
            break;
        }
    }

    // top-yを求める
    for (let row = 0; row < pixels.height; row++) {
        for (let col = targetLeftX; col <= targetRightX; col++) {
            const i = row * pixels.width * 4 + col * 4;
            if (data[i] !== 255) {
                targetTopY = row;
                break;
            }
        }
        if (targetTopY !== -1) {
            break;
        }
    }

    // bottom-yを求める
    for (let row = pixels.height - 1; row >= 0; row--) {
        for (let col = targetLeftX; col <= targetRightX; col++) {
            const i = row * pixels.width * 4 + col * 4;
            if (data[i] !== 255) {
                targetBottomY = row;
                break;
            }
        }
        if (targetBottomY !== -1) {
            break;
        }
    }

    return {
        x: targetLeftX, y: targetTopY,
        width: targetRightX - targetLeftX + 1,
        height: targetBottomY - targetTopY + 1
    };
}
