// * desc    : Capitalize the first letter of each word in a string
// * Testing: Passed ✔ (29-12-2022)

const capitalizeText = (text) => {
    text = text.split(' ');
    for (let i = 0; i < text.length; i++) {
        text[i] = text[i].charAt(0).toUpperCase() + text[i].slice(1);
    }
    return text.join(' ');
};

export default capitalizeText;