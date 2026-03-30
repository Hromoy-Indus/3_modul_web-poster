/*---------------------Отслеживание курсора для глаз в верхнем меню-----------------------*/

document.addEventListener("mousemove", function (e) {
    var eyes = document.querySelectorAll(".eye");

    eyes.forEach(function (eye) {
        var orbit = eye.querySelector(".eye__orbit");
        var rect = eye.getBoundingClientRect();

        var centerX = rect.left + rect.width / 2;
        var centerY = rect.top + rect.height / 2;

        var angle = Math.atan2(e.clientY - centerY, e.clientX - centerX) * 180 / Math.PI;

        orbit.style.transform = "translate(-50%, -50%) rotate(" + (angle - 90) + "deg)";
    });
});

/*-------------------------Блок с постройкой цветов------------------------------*/

const builderData = {
    flower: {
        count: 3,
        colors: ["pink", "blue", "orange", "white"],
        currentIndex: 0,
        currentColor: "pink"
    },
    stem: {
        count: 2,
        colors: ["dark-green", "light-green"],
        currentIndex: 0,
        currentColor: "dark-green"
    },
    leaf: {
        count: 3,
        colors: ["dark-green", "light-green"],
        currentIndex: 0,
        currentColor: "dark-green"
    }
};

function getImagePath(part, color, index) {
    return `images/${part}s/GREY-${color}-${part}-${index}.png`;
}

function updateRow(row) {
    const part = row.dataset.part;
    const data = builderData[part];

    const leftItem = row.querySelector(".builder-item_left");
    const centerItem = row.querySelector(".builder-item_center");
    const rightItem = row.querySelector(".builder-item_right");

    const current = data.currentIndex + 1;
    const prev = current === 1 ? data.count : current - 1;
    const next = current === data.count ? 1 : current + 1;

    let previewColor = data.colors[0];

    leftItem.src = getImagePath(part, previewColor, prev);
    centerItem.src = getImagePath(part, data.currentColor, current);
    rightItem.src = getImagePath(part, previewColor, next);
}

function updateAllRows() {
    const rows = document.querySelectorAll(".builder-row");
    rows.forEach(function (row) {
        updateRow(row);
    });
}

document.addEventListener("DOMContentLoaded", function () {
    const rows = document.querySelectorAll(".builder-row");

    rows.forEach(function (row) {
        const part = row.dataset.part;
        const leftArrow = row.querySelector(".builder-arrow_left");
        const rightArrow = row.querySelector(".builder-arrow_right");
        const colorButtons = row.querySelectorAll(".builder-color");
        const statusButton = document.querySelector(".flower-collection__status");

        if (statusButton) {
            statusButton.addEventListener("click", function () {
                if (savedFlowers.length < maxFlowers) return;

                renderBouquet();
                showBouquetSection();
                startBouquetFaces();

                const bouquetHint = document.querySelector("#bouquet-hint");

                if (bouquetHint) {
                    bouquetHint.classList.add("is-hidden");
                }
            });
        }

        leftArrow.addEventListener("click", function () {
            builderData[part].currentIndex--;

            if (builderData[part].currentIndex < 0) {
                builderData[part].currentIndex = builderData[part].count - 1;
            }

            updateRow(row);
        });

        rightArrow.addEventListener("click", function () {
            builderData[part].currentIndex++;

            if (builderData[part].currentIndex >= builderData[part].count) {
                builderData[part].currentIndex = 0;
            }

            updateRow(row);
        });

        colorButtons.forEach(function (button) {
            button.addEventListener("click", function () {
                colorButtons.forEach(function (item) {
                    item.classList.remove("is-active");
                });

                button.classList.add("is-active");
                builderData[part].currentColor = button.dataset.color;

                updateRow(row);
            });
        });
    });

    updateAllRows();
});

document.querySelectorAll(".builder-slider").forEach(function (slider) {

    let startX = 0;

    slider.addEventListener("touchstart", function (e) {
        startX = e.touches[0].clientX;
    });

    slider.addEventListener("touchend", function (e) {
        let endX = e.changedTouches[0].clientX;
        let diff = startX - endX;

        let row = slider.closest(".builder-row");
        let part = row.dataset.part;

        if (Math.abs(diff) < 40) return;

        if (diff > 0) {
            builderData[part].currentIndex++;
            if (builderData[part].currentIndex >= builderData[part].count) {
                builderData[part].currentIndex = 0;
            }
        } else {
            builderData[part].currentIndex--;
            if (builderData[part].currentIndex < 0) {
                builderData[part].currentIndex = builderData[part].count - 1;
            }
        }

        updateRow(row);
    });

});

/*-------------------------Блок с цветами в горшках------------------------------*/

const savedFlowers = [];
const maxFlowers = 6;

function getWordByCount(count) {
    if (count === 1) return "цветок";
    if (count >= 2 && count <= 4) return "цветка";
    return "цветов";
}

function getGreyImagePath(part, color, index) {
    if (part === "flower") {
        return `images/flowers/GREY-${color}-flower-${index}.png`;
    }

    if (part === "stem") {
        return `images/stems/GREY-${color}-stem-${index}.png`;
    }

    if (part === "leaf") {
        return `images/leafs/GREY-${color}-leaf-${index}.png`;
    }
}

function getCurrentFlowerData() {
    return {
        flower: {
            index: builderData.flower.currentIndex + 1,
            color: builderData.flower.currentColor
        },
        stem: {
            index: builderData.stem.currentIndex + 1,
            color: builderData.stem.currentColor
        },
        leaf: {
            index: builderData.leaf.currentIndex + 1,
            color: builderData.leaf.currentColor
        }
    };
}

function renderCollection() {
    const grid = document.querySelector(".flower-collection__grid");
    const status = document.querySelector(".flower-collection__status");

    if (!grid || !status) return;

    grid.innerHTML = "";

    for (let i = 0; i < maxFlowers; i++) {
        const slot = document.createElement("div");
        slot.className = "flower-slot";

        const number = document.createElement("div");
        number.className = "flower-slot__number";
        number.textContent = i + 1;
        slot.appendChild(number);

        if (savedFlowers[i]) {
            const flower = savedFlowers[i];

            slot.innerHTML += `
                <div class="saved-flower">
                    <img class="saved-flower__stem ${flower.stem.index === 2 ? 'saved-flower__stem--2' : ''}" src="${getGreyImagePath("stem", flower.stem.color, flower.stem.index)}" alt="">
                    <img class="saved-flower__leaf saved-flower__leaf--left saved-flower__leaf--type-${flower.leaf.index}"
                         src="${getGreyImagePath("leaf", flower.leaf.color, flower.leaf.index)}" alt="">

                    <img class="saved-flower__leaf saved-flower__leaf--right saved-flower__leaf--type-${flower.leaf.index}"
                         src="${getGreyImagePath("leaf", flower.leaf.color, flower.leaf.index)}" alt="">

                    <img class="saved-flower__bud" src="${getGreyImagePath("flower", flower.flower.color, flower.flower.index)}" alt="">
                    <img class="saved-flower__pot" src="images/pot.png" alt="">
                </div>
            `;
        } else {
            slot.classList.add("flower-slot_empty");

            slot.innerHTML += `
                <img class="flower-slot__placeholder" src="images/empty-flower.png" alt="">
            `;
        }

        grid.appendChild(slot);
    }

    const left = maxFlowers - savedFlowers.length;

    if (left > 0) {
        status.textContent = `осталось добавить (${left}) ${getWordByCount(left)}`;
        status.classList.remove("is-ready");
        status.disabled = true;
    } else {
        status.textContent = "создать букет";
        status.classList.add("is-ready");
        status.disabled = false;
    }
}

document.addEventListener("DOMContentLoaded", function () {
    const addButton = document.querySelector(".builder-add");

    renderCollection();

    if (addButton) {
        addButton.addEventListener("click", function () {
            if (savedFlowers.length >= maxFlowers) return;

            savedFlowers.push(getCurrentFlowerData());
            renderCollection();
        });
    }
});

/*-------------------------раздел с цветами в вазе------------------------------*/

function showBouquetSection() {
    const bouquetSection = document.querySelector("#bouquet-section");

    if (!bouquetSection) return;

    bouquetSection.classList.add("is-visible");
}

function getColorImagePath(part, color, index) {
    if (part === "flower") {
        return `images/flowers/${color}-flower-${index}.png`;
    }

    if (part === "stem") {
        return `images/stems/${color}-stem-${index}.png`;
    }

    if (part === "leaf") {
        return `images/leafs/${color}-leaf-${index}.png`;
    }
}

const bouquetPositions = [
    { className: "bouquet-slot--1" },
    { className: "bouquet-slot--2" },
    { className: "bouquet-slot--3" },
    { className: "bouquet-slot--4" },
    { className: "bouquet-slot--5" },
    { className: "bouquet-slot--6" }
];

function renderBouquet() {
    const bouquetFlowers = document.querySelector("#bouquet-flowers");

    if (!bouquetFlowers) return;

    bouquetFlowers.innerHTML = "";

    savedFlowers.forEach(function (flower, index) {
        const position = bouquetPositions[index];

        if (!position) return;

        const flowerElement = document.createElement("div");
        flowerElement.className = `bouquet-flower ${position.className}`;

        flowerElement.innerHTML = `
            <img class="bouquet-flower__stem ${flower.stem.index === 2 ? 'bouquet-flower__stem--2' : ''}" 
                 src="${getColorImagePath("stem", flower.stem.color, flower.stem.index)}" alt="">

            <img class="bouquet-flower__leaf bouquet-flower__leaf--left bouquet-flower__leaf--type-${flower.leaf.index}" 
                 src="${getColorImagePath("leaf", flower.leaf.color, flower.leaf.index)}" alt="">

            <img class="bouquet-flower__leaf bouquet-flower__leaf--right bouquet-flower__leaf--type-${flower.leaf.index}" 
                 src="${getColorImagePath("leaf", flower.leaf.color, flower.leaf.index)}" alt="">

            <img class="bouquet-flower__bud" 
                 src="${getColorImagePath("flower", flower.flower.color, flower.flower.index)}" alt="">
        `;

        bouquetFlowers.appendChild(flowerElement);
    });
}

function startBouquetFaces() {
    const bouquetSection = document.querySelector("#bouquet-section");
    const bouquet = bouquetSection.querySelector(".bouquet");
    const faces = bouquetSection.querySelectorAll(".bouquet-face");

    if (!bouquetSection || !bouquet || !faces.length) return;
    if (bouquetSection.dataset.facesStarted === "true") return;

    bouquetSection.dataset.facesStarted = "true";

    const zones = [
        { minX: 8, maxX: 24, minY: 16, maxY: 42 },
        { minX: 72, maxX: 90, minY: 14, maxY: 38 },
        { minX: 8, maxX: 26, minY: 44, maxY: 78 },
        { minX: 66, maxX: 86, minY: 38, maxY: 66 },
        { minX: 82, maxX: 96, minY: 48, maxY: 82 }
    ];

    function moveFace(face, zone) {
        const sectionRect = bouquetSection.getBoundingClientRect();
        const bouquetRect = bouquet.getBoundingClientRect();

        const bouquetCenterX = bouquetRect.left + bouquetRect.width / 2;
        const bouquetCenterY = bouquetRect.top + bouquetRect.height / 2;

        const randomXPercent = zone.minX + Math.random() * (zone.maxX - zone.minX);
        const randomYPercent = zone.minY + Math.random() * (zone.maxY - zone.minY);

        const x = sectionRect.width * randomXPercent / 100;
        const y = sectionRect.height * randomYPercent / 100;

        const faceCenterX = sectionRect.left + x;
        const faceCenterY = sectionRect.top + y;

        let angle = Math.atan2(
            bouquetCenterY - faceCenterY,
            bouquetCenterX - faceCenterX
        ) * 180 / Math.PI;

        if (angle > 90) {
            angle -= 180;
        }

        if (angle < -90) {
            angle += 180;
        }

        angle = angle * 0.35;

        face.style.left = `${randomXPercent}%`;
        face.style.top = `${randomYPercent}%`;
        face.style.transform = `translate(-50%, -50%) rotate(${angle}deg)`;

        const nextDelay = 1400 + Math.random() * 1400;

        setTimeout(function () {
            moveFace(face, zone);
        }, nextDelay);
    }

    faces.forEach(function (face, index) {
        const zone = zones[index];

        setTimeout(function () {
            moveFace(face, zone);
        }, index * 200);
    });
}

/*-------------------------раздел с 4 эмоциями и глазами------------------------------*/

const emotionBalls = document.querySelectorAll(".emotion-ball");

emotionBalls.forEach(function (ball) {
    const image = ball.querySelector(".emotion-ball__image");

    if (!image) return;

    ball.addEventListener("click", function () {
        image.src = image.dataset.color;
        ball.classList.add("is-active");
    });
});


document.addEventListener("mousemove", function (e) {
    const eyes = document.querySelectorAll(".emotion-eye");

    eyes.forEach(function (eye) {
        const orbit = eye.querySelector(".emotion-eye__orbit");
        const rect = eye.getBoundingClientRect();

        const centerX = rect.left + rect.width / 2;
        const centerY = rect.top + rect.height / 2;

        const angle = Math.atan2(e.clientY - centerY, e.clientX - centerX) * 180 / Math.PI;

        orbit.style.transform = "translate(-50%, -50%) rotate(" + (angle - 90) + "deg)";
    });
});


document.addEventListener("mousemove", function (e) {
    emotionBalls.forEach(function (ball) {
        if (!ball.classList.contains("is-active")) return;

        const rect = ball.getBoundingClientRect();
        const centerX = rect.left + rect.width / 2;
        const centerY = rect.top + rect.height / 2;

        let angle = Math.atan2(e.clientY - centerY, e.clientX - centerX) * 180 / Math.PI;

        if (angle > 90) {
            angle -= 180;
        }

        if (angle < -90) {
            angle += 180;
        }

        angle = angle * 0.22;

        const image = ball.querySelector(".emotion-ball__image");
        if (image) {
            image.style.transform = "rotate(" + angle + "deg)";
        }
    });
});

const deliveryButton = document.querySelector(".bouquet-delivery__button");
const deliveryModal = document.querySelector("#delivery-modal");
const deliveryClose = document.querySelector(".delivery-modal__close");

if (deliveryButton && deliveryModal) {
    deliveryButton.addEventListener("click", function () {
        deliveryModal.classList.add("is-visible");
    });
}

if (deliveryClose && deliveryModal) {
    deliveryClose.addEventListener("click", function () {
        deliveryModal.classList.remove("is-visible");
    });
}

if (deliveryModal) {
    deliveryModal.addEventListener("click", function (event) {
        if (event.target === deliveryModal) {
            deliveryModal.classList.remove("is-visible");
        }
    });
}