const convertRemToPixels = rem =>  {
    return parseFloat(rem) * parseFloat(getComputedStyle(document.documentElement).fontSize);
}

export { convertRemToPixels }
