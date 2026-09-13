import { HashRouter, Routes, Route } from "react-router-dom";

import Page1 from "./pages/ui-animations/page";
import Page2 from "./pages/ui-animations/2/page";
import Page3 from "./pages/ui-animations/3/page";
import Page4 from "./pages/ui-animations/4/page";
import Page5 from "./pages/ui-animations/5/page";
import Page6 from "./pages/ui-animations/6/page";
import Page7 from "./pages/ui-animations/7/page";
import Page8 from "./pages/ui-animations/8/page";
import Page9 from "./pages/ui-animations/9/page";
import Page10 from "./pages/ui-animations/10/page";
import Page11 from "./pages/ui-animations/11/page";
import Page12 from "./pages/ui-animations/12/page";
import Page13 from "./pages/ui-animations/13/page";
import Page14 from "./pages/ui-animations/14/page";
import Page15 from "./pages/ui-animations/15/page";
import Page16 from "./pages/ui-animations/16/page";
import Page17 from "./pages/ui-animations/17/page";

// One route per DIY animation, numbered to match assets/items.js in the
// dashboard folder above this one. Hash routing (not path-based) is
// deliberate: it works from a plain static file server with zero rewrite
// rules, and survives being opened straight off disk.
export default function App() {
  return (
    <HashRouter>
      <Routes>
        <Route path="/" element={<Page1 />} />
        <Route path="/2" element={<Page2 />} />
        <Route path="/3" element={<Page3 />} />
        <Route path="/4" element={<Page4 />} />
        <Route path="/5" element={<Page5 />} />
        <Route path="/6" element={<Page6 />} />
        <Route path="/7" element={<Page7 />} />
        <Route path="/8" element={<Page8 />} />
        <Route path="/9" element={<Page9 />} />
        <Route path="/10" element={<Page10 />} />
        <Route path="/11" element={<Page11 />} />
        <Route path="/12" element={<Page12 />} />
        <Route path="/13" element={<Page13 />} />
        <Route path="/14" element={<Page14 />} />
        <Route path="/15" element={<Page15 />} />
        <Route path="/16" element={<Page16 />} />
        <Route path="/17" element={<Page17 />} />
      </Routes>
    </HashRouter>
  );
}
