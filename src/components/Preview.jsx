import React, { useRef, useState } from 'react';
import { jsPDF } from 'jspdf';
import html2canvas from 'html2canvas';
import { Mail, Download, ArrowRight, Loader2 } from 'lucide-react';

const Preview = ({ data, fileName, metadata, onBack }) => {
    const [loading, setLoading] = useState(false);
    const [email, setEmail] = useState('');
    const [status, setStatus] = useState('');
    const previewRef = useRef();

    const generatePDF = async () => {
        const canvas = await html2canvas(previewRef.current, { scale: 2 });
        const imgData = canvas.toDataURL('image/png');
        const pdf = new jsPDF('p', 'mm', 'a4');
        const imgProps = pdf.getImageProperties(imgData);
        const pdfWidth = pdf.internal.pageSize.getWidth();
        const pdfHeight = (imgProps.height * pdfWidth) / imgProps.width;
        pdf.addImage(imgData, 'PNG', 0, 0, pdfWidth, pdfHeight);
        return pdf;
    };

    const handleDownload = async () => {
        setLoading(true);
        const pdf = await generatePDF();
        pdf.save(`${fileName.split('.')[0]}_edited.pdf`);
        setLoading(false);
    };

    const handleSendEmail = async () => {
        if (!email) return alert('الرجاء إدخال البريد الإلكتروني');
        setLoading(true);
        setStatus('جاري إرسال البريد...');

        try {
            const pdf = await generatePDF();
            const pdfBlob = pdf.output('blob');

            const formData = new FormData();
            formData.append('pdf', pdfBlob, 'document.pdf');
            formData.append('email', email);
            formData.append('subject', metadata.subject);
            formData.append('message', metadata.message);

            const response = await fetch('http://localhost:5000/send-email', {
                method: 'POST',
                body: formData,
            });

            if (response.ok) {
                setStatus('تم إرسال البريد بنجاح! ✅');
            } else {
                setStatus('فشل إرسال البريد. ❌');
            }
        } catch (error) {
            console.error(error);
            setStatus('خطأ في الاتصال بالخادم. ❌');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
                <h2>معاينة المستند</h2>
                <button className="btn" onClick={onBack}>
                    <ArrowRight size={20} /> العودة للتعديل
                </button>
            </div>

            <div ref={previewRef} style={{
                padding: '3rem',
                background: '#fff',
                color: '#000',
                borderRadius: '0.5rem',
                fontFamily: 'Arial, sans-serif'
            }}>
                {/* Report Header */}
                <div style={{
                    borderBottom: '3px solid #217346',
                    paddingBottom: '1.5rem',
                    marginBottom: '2rem'
                }}>
                    <h1 style={{
                        fontSize: '2rem',
                        color: '#1e293b',
                        marginBottom: '0.5rem',
                        fontWeight: '700'
                    }}>
                        {metadata.subject || 'تقرير البيانات'}
                    </h1>
                    <div style={{
                        display: 'flex',
                        justifyContent: 'space-between',
                        fontSize: '0.875rem',
                        color: '#64748b',
                        marginTop: '1rem'
                    }}>
                        <span>📅 التاريخ: {new Date().toLocaleDateString('ar-EG')}</span>
                        <span></span>
                    </div>
                </div>

                {/* Report Description */}
                {metadata.message && (
                    <div style={{
                        background: '#f8fafc',
                        padding: '1.5rem',
                        borderRadius: '0.5rem',
                        marginBottom: '2rem',
                        borderRight: '4px solid #217346'
                    }}>
                        <h3 style={{
                            fontSize: '1rem',
                            color: '#475569',
                            marginBottom: '0.5rem',
                            fontWeight: '600'
                        }}>
                            📋 الوصف:
                        </h3>
                        <p style={{
                            fontSize: '0.95rem',
                            color: '#64748b',
                            lineHeight: '1.6',
                            margin: 0
                        }}>
                            {metadata.message}
                        </p>
                    </div>
                )}

                {/* Data Table */}
                <div style={{ marginTop: '2rem' }}>
                    <h3 style={{
                        fontSize: '1.1rem',
                        color: '#1e293b',
                        marginBottom: '1rem',
                        fontWeight: '600'
                    }}>
                        📊 البيانات التفصيلية:
                    </h3>
                    <table style={{
                        width: '100%',
                        borderCollapse: 'collapse',
                        fontSize: '0.9rem'
                    }}>
                        <thead>
                            <tr>
                                {data[0]?.map((header, idx) => (
                                    <th key={idx} style={{
                                        background: 'linear-gradient(135deg, #217346 0%, #1e623c 100%)',
                                        color: 'white',
                                        padding: '1rem 0.75rem',
                                        textAlign: 'right',
                                        fontWeight: '600',
                                        fontSize: '0.875rem',
                                        border: '1px solid #1a5a36'
                                    }}>
                                        {header}
                                    </th>
                                ))}
                            </tr>
                        </thead>
                        <tbody>
                            {data.slice(1).map((row, rowIndex) => (
                                <tr key={rowIndex} style={{
                                    background: rowIndex % 2 === 0 ? '#ffffff' : '#f8fafc'
                                }}>
                                    {row.map((cell, colIndex) => (
                                        <td key={colIndex} style={{
                                            padding: '0.875rem 0.75rem',
                                            border: '1px solid #e2e8f0',
                                            color: '#334155',
                                            textAlign: 'right'
                                        }}>
                                            {cell}
                                        </td>
                                    ))}
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>

                {/* Report Footer */}
                <div style={{
                    marginTop: '3rem',
                    paddingTop: '1.5rem',
                    borderTop: '2px solid #e2e8f0',
                    textAlign: 'center',
                    fontSize: '0.75rem',
                    color: '#94a3b8'
                }}>
                    <p style={{ margin: 0 }}>
                        تم إنشاء هذا التقرير بواسطة محرر إكسيل أونلاين • {new Date().toLocaleString('ar-EG')}
                    </p>
                </div>
            </div>

            <div className="actions-bar" style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem', marginTop: '2rem' }}>
                <div style={{ display: 'flex', gap: '1rem', justifyContent: 'center' }}>
                    <button className="btn btn-success" onClick={handleDownload} disabled={loading}>
                        {loading ? <Loader2 className="animate-spin" /> : <Download size={20} />} تحميل PDF
                    </button>
                </div>

                <div style={{ background: '#f1f5f9', padding: '1.5rem', borderRadius: '0.75rem', maxWidth: '500px', margin: '0 auto', width: '100%' }}>
                    <h4 style={{ marginBottom: '1rem' }}>إرسال عبر البريد الإلكتروني</h4>
                    <div style={{ display: 'flex', gap: '0.5rem' }}>
                        <input
                            type="email"
                            placeholder="example@mail.com"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            style={{ flex: 1, padding: '0.75rem', borderRadius: '0.5rem', border: '1px solid #cbd5e1' }}
                        />
                        <button className="btn btn-primary" onClick={handleSendEmail} disabled={loading}>
                            <Mail size={20} /> إرسال
                        </button>
                    </div>
                    {status && <p style={{ marginTop: '1rem', fontWeight: '600', textAlign: 'center' }}>{status}</p>}
                </div>
            </div>
        </div>
    );
};

export default Preview;
