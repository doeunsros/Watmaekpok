import Link from "next/link";
export default function SiteHeader() {
  return <>
    <div className="topline"><div className="container">សូមស្វាគមន៍មកកាន់គេហទំព័រវត្តមែកពក</div></div>
    <header className="nav"><div className="container navinner">
      <Link href="/" className="brand"><span className="brandmark">☸</span><span>វត្តមែកពក<br/><small style={{fontWeight:400,color:"#73766c"}}>ព្រះធម៌ • សាមគ្គីភាព • ប្រពៃណី</small></span></Link>
      <nav className="links" aria-label="ម៉ឺនុយមេ">
        <Link href="/">ទំព័រដើម</Link><Link href="/about">អំពីវត្ត</Link><Link href="/news">ព័ត៌មាន</Link><Link href="/events">កម្មវិធីបុណ្យ</Link><Link href="/gallery">វិចិត្រសាល</Link><Link href="/location">ទីតាំង</Link><Link href="/contact">ទំនាក់ទំនង</Link>
      </nav>
    </div></header>
  </>;
}