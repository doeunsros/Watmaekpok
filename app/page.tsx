import Link from "next/link";
import Image from "next/image";
import PageShell from "@/components/PageShell";
import { photos, news } from "@/lib/content";

export default function Home() {
 return <PageShell>
  <main>
   <section className="hero"><div className="container hero-content">
    <div className="eyebrow">សន្តិភាព • ព្រះធម៌ • ប្រពៃណីខ្មែរ</div>
    <h1>សូមស្វាគមន៍មកកាន់<br/>វត្តមែកពក</h1>
    <p style={{fontSize:18,maxWidth:650}}>ទីកន្លែងនៃសេចក្តីស្ងប់សុខ ព្រះធម៌ ប្រពៃណី និងសាមគ្គីភាពក្នុងសហគមន៍។ ស្វែងយល់អំពីព័ត៌មាន និងសកម្មភាពរបស់វត្តតាមរយៈគេហទំព័រនេះ។</p>
    <div style={{display:"flex",gap:12,flexWrap:"wrap",marginTop:28}}><Link className="btn" href="/about">ស្វែងយល់អំពីវត្ត</Link><Link className="btn outline" href="/gallery">មើលរូបភាពវត្ត</Link></div>
   </div></section>
   <section className="section"><div className="container split">
    <div><span className="pill">អំពីវត្តមែកពក</span><h2>ថែរក្សាព្រះធម៌ និងមរតកវប្បធម៌ខ្មែរ</h2><p className="lead">គេហទំព័រនេះជាចំណុចកណ្ដាលសម្រាប់ស្វែងរកព័ត៌មានអំពីវត្ត កម្មវិធីបុណ្យ ព័ត៌មានជូនដំណឹង និងរូបភាពសកម្មភាពផ្សេងៗ។ ប្រវត្តិ និងព័ត៌មានជាក់លាក់នឹងត្រូវបញ្ចូលដោយអ្នកគ្រប់គ្រងវត្ត។</p><Link className="btn" href="/about">អានបន្ថែម</Link>
     <div className="stats"><div className="stat"><strong>ព័ត៌មាន</strong><span className="muted">ប្រកាសពីវត្ត</span></div><div className="stat"><strong>កម្មវិធីបុណ្យ</strong><span className="muted">កាលវិភាគសកម្មភាព</span></div><div className="stat"><strong>វិចិត្រសាល</strong><span className="muted">រូបភាពអនុស្សាវរីយ៍</span></div></div>
    </div><Image src={photos.temple} alt="គំនូរប្លង់ស្ថាបត្យកម្មព្រះវិហារវត្តមែកពក" width={800} height={650}/>
   </div></section>
   <section className="section" style={{background:"#f5efdf"}}><div className="container">
    <div className="section-head"><div><span className="pill">ព័ត៌មានថ្មីៗ</span><h2>ព័ត៌មាន និងសេចក្តីជូនដំណឹង</h2><p className="lead">សូមពិនិត្យព័ត៌មានផ្លូវការដែលបានបញ្ចូលដោយអ្នកគ្រប់គ្រង។</p></div><Link href="/news" className="btn">មើលព័ត៌មានទាំងអស់</Link></div>
    <div className="grid">{news.map((item)=> <article className="card" key={item.title}><Image src={item.image} alt={item.title} width={700} height={420}/><div className="card-body"><span className="pill">{item.category}</span><h3>{item.title}</h3><p className="muted">{item.description}</p><span className="muted">{item.date}</span></div></article>)}</div>
   </div></section>
   <section className="section"><div className="container">
    <div className="section-head"><div><span className="pill">រូបភាព</span><h2>ទិដ្ឋភាព និងសកម្មភាព</h2><p className="lead">រូបថតពិត និងគំនូរប្លង់ស្ថាបត្យកម្មនៃវត្តមែកពក។</p></div><Link href="/gallery" className="btn">ចូលវិចិត្រសាល</Link></div>
    <div className="gallery">{[photos.hero, photos.temple, photos.architecture, photos.ceremony].map((src,i)=><Image key={src} src={src} alt={`រូបភាពវត្តមែកពក ${i+1}`} width={500} height={360}/>)}</div>
   </div></section>
   <section className="section"><div className="container"><div className="cta"><div><h2>ចង់ស្វែងរកទីតាំងវត្ត?</h2><p>ស្វែងរកអាសយដ្ឋាន និងព័ត៌មានធ្វើដំណើរទៅកាន់វត្ត។</p></div><Link className="btn" href="/location">មើលទីតាំងវត្ត</Link></div></div></section>
  </main>
 </PageShell>;
}