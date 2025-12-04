interface StyleInfo {
    name: string;
    file: string;
}

const availableStyles: StyleInfo[] = [
    { name: "Styl 1", file: "/style-1.css" },
    { name: "Styl 2", file: "/style-2.css" },
    { name: "Styl 3", file: "/style-3.css" }
];

let currentIndex = 0;

function applyCurrentStyle() {
    const styleElement = document.getElementById("dynamic-style") as HTMLLinkElement;
    styleElement.href = availableStyles[currentIndex].file;
}

function createStyleLinks() {
    const container = document.getElementById("style-switcher") as HTMLElement;

    availableStyles.forEach((style, index) => {
        const link = document.createElement("a");
        link.href = "#";
        link.textContent = style.name;
        link.style.marginRight = "15px";
        link.style.fontSize = "18px";

        link.addEventListener("click", (e) => {
            e.preventDefault();
            currentIndex = index;
            applyCurrentStyle();
        });

        container.appendChild(link);
    });
}

document.addEventListener("DOMContentLoaded", () => {
    applyCurrentStyle();
    createStyleLinks();
});

const msg: string = "Hello!";
alert(msg);