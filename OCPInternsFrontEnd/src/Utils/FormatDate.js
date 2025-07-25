export function formatValidStringToDate ( dateString ){
    const newDate = new Date( dateString );
    return newDate.toLocaleDateString();
}