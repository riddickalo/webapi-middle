/* response zip file is deprecated */
import archiver from 'archiver';
async function getReport(req, res) {
    const query = {
        type: req.query.type.split('_'),
        startTime: req.query.startTime.split('-'),
        endTime: req.query.endTime.split('-'),
    };

    try{
        if(query.type[0] === 'nc') {
            const reports = await formNcReport(query);
            const filename = `${req.query.type[0]}_${req.query.endTime}.zip`;
            // console.log(reports)

            const zipper = archiver('zip', { zlib: { level: 9 }});         
            zipper.on('warning', (err) => {
                if(err.code === 'ENONET') console.log(err);
                else throw err;
            });
            // response
            // res.header('Content-Type: application/zip;');
            // res.header(`Content-Disposition: attachment; filename=${filename}`);
            res.attachment(filename);
            zipper.pipe(res);       // zip file stream destination
            reports.map(row => {    // append files into zip
                zipper.append(row.file, { name: `${row.nc_id}_${query.type[1]}.csv` })
            });
            zipper.finalize();      // finish and send file

        } else if(query.type[0] === 'item') {
            let retData = await formItemReport(report_type[1]);
            const filename = `${req.query.type}_${req.query.endTime}.csv`;
            // response
            res.header('Content-Type: text/csv; charset=utf-8;');
            res.attachment(filename);
            res.status(200).send(json2csv(retData));

        }
    } catch(err) {
        console.error(err);
        res.status(500).send(err);
    }
}