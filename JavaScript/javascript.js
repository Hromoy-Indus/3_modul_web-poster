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