export const insertDelimitersAtPositions = (content:string, positions:any) => {
    let offset = 0;

    positions.forEach((position) => {
        content =
            content.slice(0, position + offset) +
            '<!-- delimiter -->' +
            content.slice(position + offset);
        offset += '<!-- delimiter -->'.length;
    });

    return content;
};