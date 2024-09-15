import archiver from 'archiver';

const zipper = archiver('zip', { zlib: { level: 9 }});

zipper.on('warning', (err) => {
    if(err.code === 'ENONET') {
        console.log(err);
    } else {
        throw err;
    }
});

export function zipReports(reportList, reportType='month') {
    for(let row of reportList) {
        zipper.append(row.file, { name: `${row.nc_id}_${reportType}.csv` });
    }    

    return zipper.finalize();
}

