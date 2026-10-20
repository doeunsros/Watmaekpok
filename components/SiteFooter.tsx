import Link from "next/link";
export default function SiteFooter() {
 return <footer className="footer"><div className="container"><div className="footergrid">
  <div><h3>វត្តមែកពក</h3><p>គេហទំព័រនេះបង្កើតឡើងដើម្បីជួយឱ្យពុទ្ធបរិស័ទងាយស្រួលស្វែងយល់អំពីព័ត៌មាន សកម្មភាព និងកម្មវិធីបុណ្យរបស់វត្ត។</p></div>
  <div><h3>តំណភ្ជាប់</h3><p><Link href="/about">អំពីវត្ត</Link></p><p><Link href="/news">ព័ត៌មាន</Link></p><p><Link href="/gallery">វិចិត្រសាល</Link></p></div>
  <div><h3>ព័ត៌មានទំនាក់ទំនង</h3><p>ទីតាំង៖ សូមបញ្ចូលអាសយដ្ឋានវត្ត</p><p>ទូរស័ព្ទ៖ សូមបញ្ចូលលេខទំនាក់ទំនង</p></div>
 </div><hr style={{borderColor:"#ffffff2b",margin:"28px 0 18px"}}/><div className="small">© {new Date().getFullYear()} វត្តមែកពក។ រក្សាសិទ្ធិគ្រប់យ៉ាង។</div></div></footer>;
}