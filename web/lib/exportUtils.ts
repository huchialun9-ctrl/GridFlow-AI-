
// Browser-only library imports wrapped for SSR safety
let XLSX: any;
let docx: any;
let PptxGenJS: any;

const initLibs = async () => {
    if (typeof window === 'undefined') return;
    if (!XLSX) XLSX = await import('xlsx');
    if (!docx) docx = await import('docx');
    if (!PptxGenJS) {
        const mod = await import('pptxgenjs');
        PptxGenJS = mod.default || mod;
    }
};

export const exportToExcel = async (headers: string[], rows: any[][], filename: string) => {
    if (typeof window === 'undefined') return;
    await initLibs();
    const worksheet = XLSX.utils.aoa_to_sheet([headers, ...rows]);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Data");
    XLSX.writeFile(workbook, `${filename}.xlsx`);
};

export const exportToWord = async (headers: string[], rows: any[][], filename: string) => {
    if (typeof window === 'undefined') return;
    await initLibs();
    const { Document, Packer, Paragraph, HeadingLevel, Table, TableRow, TableCell, WidthType } = docx;

    const isSemantic = headers.includes('role') && headers.includes('content');

    let children: any[] = [];

    if (isSemantic) {
        const roleIdx = headers.indexOf('role');
        const contentIdx = headers.indexOf('content');

        rows.forEach(row => {
            const role = String(row[roleIdx]).toLowerCase();
            const content = String(row[contentIdx]);

            if (role.includes('title')) {
                children.push(new Paragraph({
                    text: content,
                    heading: HeadingLevel.HEADING_1,
                    spacing: { before: 800, after: 400 },
                    alignment: 'center'
                }));
            } else if (role.includes('summary')) {
                children.push(new Paragraph({
                    text: content,
                    spacing: { before: 200, after: 400 },
                    shading: { fill: 'F1F5F9' },
                    border: { left: { color: '4B44E5', space: 20, style: 'single', size: 30 } }
                }));
            } else if (role.includes('section header') || role.includes('heading')) {
                children.push(new Paragraph({
                    text: content,
                    heading: HeadingLevel.HEADING_2,
                    spacing: { before: 600, after: 200 },
                }));
            } else if (role.includes('sub header')) {
                children.push(new Paragraph({
                    text: content,
                    heading: HeadingLevel.HEADING_3,
                    spacing: { before: 400, after: 200 },
                }));
            } else if (role.includes('bullet') || role.includes('list')) {
                children.push(new Paragraph({
                    text: content,
                    bullet: { level: 0 },
                    spacing: { after: 120 }
                }));
            } else if (role.includes('quote')) {
                children.push(new Paragraph({
                    text: content,
                    spacing: { before: 300, after: 300 },
                    alignment: 'center',
                    italics: true,
                    style: 'Quote'
                }));
            } else if (role.includes('callout')) {
                children.push(new Paragraph({
                    text: `💡 ${content}`,
                    spacing: { before: 300, after: 300 },
                    shading: { fill: 'EFF6FF' },
                    bold: true
                }));
            } else {
                children.push(new Paragraph({
                    text: content,
                    spacing: { after: 240 },
                }));
            }
        });
    } else {
        children.push(new Paragraph({
            text: filename.replace(/_/g, ' '),
            heading: HeadingLevel.HEADING_1,
            spacing: { after: 400 },
        }));
        children.push(new Table({
            width: { size: 100, type: WidthType.PERCENTAGE },
            rows: [
                new TableRow({
                    children: headers.map(header => new TableCell({
                        children: [new Paragraph({ text: header, bold: true })],
                        shading: { fill: "f3f4f6" }
                    })),
                }),
                ...rows.map(row => new TableRow({
                    children: row.map(cell => new TableCell({
                        children: [new Paragraph({ text: String(cell) })],
                    })),
                })),
            ],
        }));
    }

    const doc = new Document({ sections: [{ children }] });
    const blob = await Packer.toBlob(doc);
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${filename}.docx`;
    a.click();
    window.URL.revokeObjectURL(url);
};

export const exportToPPT = async (headers: string[], rows: any[][], filename: string) => {
    if (typeof window === 'undefined') return;
    await initLibs();
    const pres = new PptxGenJS();
    const isSlideData = headers.includes('slide_title') && headers.includes('bullet_points');
    const hasSlideType = headers.includes('slide_type');

    if (isSlideData) {
        const titleIdx = headers.indexOf('slide_title');
        const bulletIdx = headers.indexOf('bullet_points');
        const typeIdx = headers.indexOf('slide_type');

        rows.forEach(row => {
            const title = String(row[titleIdx]);
            const type = hasSlideType ? String(row[typeIdx]).toLowerCase() : 'contentslide';
            let bullets = row[bulletIdx];
            if (typeof bullets === 'string' && bullets.startsWith('[')) {
                try { bullets = JSON.parse(bullets); } catch (e) { }
            }
            const bulletList = Array.isArray(bullets) ? bullets : [String(bullets)];

            let dataSlide = pres.addSlide();

            if (type.includes('title')) {
                dataSlide.background = { color: '1E293B' };
                dataSlide.addText(title, { x: 1, y: 3.5, w: 8, fontSize: 44, bold: true, color: 'FFFFFF', align: 'center' });
                dataSlide.addText(bulletList.join(' | '), { x: 1, y: 4.5, w: 8, fontSize: 18, color: '94A3B8', align: 'center' });
            } else if (type.includes('summary')) {
                dataSlide.addText(title, { x: 0.5, y: 0.5, fontSize: 32, bold: true, color: '4B44E5' });
                dataSlide.addShape(pres.ShapeType.rect, { x: 0.5, y: 1.2, w: 9, h: 4, fill: { color: 'F1F5F9' } });
                dataSlide.addText(bulletList.map(b => ({ text: b, options: { bullet: true, italic: true } })), { x: 1, y: 1.5, w: 8, h: 3, fontSize: 20 });
            } else {
                dataSlide.addText(title, { x: 0.5, y: 0.5, w: 9, fontSize: 28, bold: true, color: '1E293B' });
                dataSlide.addText(
                    bulletList.map((b: string) => ({ text: b, options: { bullet: true, indentLevel: 0, fontSize: 18, color: '475569' } })),
                    { x: 0.5, y: 1.5, w: 9, h: 4 }
                );
            }
        });
    } else if (rows.length > 0) {
        const chunkSize = 8;
        for (let i = 0; i < rows.length; i += chunkSize) {
            const chunk = rows.slice(i, i + chunkSize);
            let dataSlide = pres.addSlide();
            dataSlide.addText(`Data Snapshot (Part ${Math.floor(i / chunkSize) + 1})`, { x: 0.5, y: 0.5, fontSize: 18, bold: true, color: '4B44E5' });
            dataSlide.addTable([headers, ...chunk], { x: 0.5, y: 1.2, w: 9, fontSize: 10, border: { type: 'solid', color: 'E2E8F0' }, fill: { color: 'F8FAFC' } });
        }
    }

    pres.writeFile({ fileName: `${filename}.pptx` });
};

export const exportToCSV = async (headers: string[], rows: any[][], filename: string) => {
    if (typeof window === 'undefined') return;
    await initLibs();
    const worksheet = XLSX.utils.aoa_to_sheet([headers, ...rows]);
    const csvContent = XLSX.utils.sheet_to_csv(worksheet);
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${filename}.csv`;
    a.click();
    window.URL.revokeObjectURL(url);
};
