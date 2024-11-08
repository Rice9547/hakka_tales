import { useParams } from "react-router-dom";
// import { useNavigate } from 'react-router-dom';
import { useRef, useState, useEffect } from "react";
import { gsap } from "gsap";
import { ArrowClockwise, Grid3x3GapFill, X } from "react-bootstrap-icons";

// import OverView from './Overview';
import "./Content.css";

function Content() {
  const { bookIndex } = useParams();
  // console.log("bookIndex = ", bookIndex);
  // get the page content and page image from backend
  // data = getDataFromBackend(bookIndex, pageNum);

  // mock data
  const data = {
    content:
      "深山裡住著一家人，有一天，爸媽要出門辦事，只留姊弟兩人看家。因為深山裡有會吃人的妖怪，所以爸媽出門前特別交代，千萬不能讓不認識的人進門。",
    src: "https://tse2.mm.bing.net/th?id=OIG3.DWY08uuzblpK7F1g7W6c&pid=ImgGn",
  };
  const totalPage = 20;

  const pageWrapperRef = useRef();
  const pagesRefs = useRef([]);
  const [pageLocation, setPageLocation] = useState({});
  const [pageIndex, setPageIndex] = useState(1);
  const [isOverviewOpen, setIsOverviewOpen] = useState(false); // Modal visibility state

  const leftZi = useRef(totalPage);
  const rightZi = useRef(0);

  const flippingFromRightToLeft = (pageId, duration = 1.5) => {
    const newZi = Math.max(leftZi.current, rightZi.current) + 1;
    $(`#${pageId}`).css("z-index", newZi);
    leftZi.current = newZi;
    gsap.to(`#${pageId}`, {
      duration: duration,
      force3D: true,
      rotationY: -180,
      transformOrigin: "-1px top",
    });
    $(`#${pageId}`).addClass("left");
    setPageLocation((prev) => ({ ...prev, [pageId]: "left" }));
    setPageIndex((pageIndex) => (pageIndex += 1));
  };

  const flippingFromLeftToRight = (pageId, duration = 1.5) => {
    const newZi = Math.max(leftZi.current, rightZi.current) + 1;
    $(`#${pageId}`).css("z-index", newZi);
    rightZi.current = newZi;
    gsap.to(`#${pageId}`, {
      duration: duration,
      force3D: true,
      rotationY: 0,
      transformOrigin: "left top",
      // Change the z-index after the animation
      onComplete: () => {
        $(`#${pageId}`).css("z-index", newZi);
      },
    });
    $(`#${pageId}`).addClass("right");
    setPageLocation((prev) => ({ ...prev, [pageId]: "right" }));
    setPageIndex((pageIndex) => (pageIndex -= 1));
  };

  const handlePageClick = (pageId) => {
    const currentLocation = pageLocation[pageId] || "right";
    if (currentLocation === "right") {
      flippingFromRightToLeft(pageId);
    } else {
      flippingFromLeftToRight(pageId);
    }
  };

  const handleHoverEnter = (pageId, foldClass) => {
    gsap.to(`#${pageId} .${foldClass}`, {
      width: "50px",
      height: "50px",
      backgroundImage:
        "linear-gradient(45deg, #fefefe 0%,#f2f2f2 49%,#ffffff 50%,#ffffff 100%)",
    });
  };

  const handleHoverLeave = (pageId, foldClass) => {
    gsap.to(`#${pageId} .${foldClass}`, { width: "0px", height: "0px" });
  };

  {
    /* New function to handle image click in overview mode */
  }
  const handleImageClick = (index) => {
    setIsOverviewOpen(false); // Close the modal
    goToPage(index + 1); // Navigate to the selected page
  };

  {
    /* Go back to the first page when the user reaches the last page. */
  }
  const navigateToFirstPage = () => {
    setPageIndex(1); // Reset pageIndex to the first page
    setPageLocation({}); // Optionally reset page locations if needed
    pagesRefs.current.forEach((page, index) => {
      if (pageLocation[`page-${index}`] === "left") {
        gsap.to(`#page-${index}`, {
          duration: 1.5,
          rotationY: 0,
          transformOrigin: "left top",
        });
      }
    });
  };

  {
    /* goToPage allows user to drag the bar to a certain page. */
  }
  const goToPage = (targetPage) => {
    if (targetPage === pageIndex) return;

    const flippingDelay = 500; // ms
    // continues turn from left to right
    if (targetPage < pageIndex) {
      for (let i = pageIndex - 1; i >= targetPage; i--) {
        setTimeout(
          () => {
            flippingFromLeftToRight(`page-${i}`);
          },
          (pageIndex - i - 1) * flippingDelay
        );
      }
    }
    // continues turn from right to left
    else {
      for (let i = pageIndex + 1; i <= targetPage; i++) {
        flippingFromRightToLeft(`page-${i - 1}`);
        // setTimeout(() => {
        //     flippingFromRightToLeft(`page-${i - 1}`);
        // }, (i - (pageIndex + 1)) * flippingDelay);
      }
    }
  };

  useEffect(() => {
    gsap.set(pageWrapperRef.current, { left: "50%", perspective: 1000 });
    gsap.set(".page", { transformStyle: "preserve-3d" });
    gsap.set(".back", { rotationY: -180 });
    gsap.set([".back", ".front"], { backfaceVisibility: "hidden" });
  }, []);

  // an array start fomr [totalPage, totalPage - 1, ... , 1]
  const reversePageNum = Array.from(
    { length: totalPage },
    (_, index) => totalPage - index
  );

  return (
    <div className="w-100 h-100 d-flex flex-column align-items-center jusitify-content-center position-relative">
      {/* BookWrapper */}
      <div className="w-100 h-100 position-relative my-5">
        <div
          className="pageWrapper p-1 w-50 h-100 position-absolute float-end"
          ref={pageWrapperRef}
        >
          {[...reversePageNum].map((pageNum, index) => (
            <div
              key={pageNum}
              id={`page-${pageNum}`}
              className="page position-absolute w-100 h-100"
              ref={(el) => (pagesRefs.current[pageNum] = el)}
              onClick={() => handlePageClick(`page-${pageNum}`)}
              style={{ zIndex: index }}
            >
              {/* front page */}
              <div
                className="front pageFace"
                onMouseEnter={() =>
                  handleHoverEnter(`page-${pageNum}`, "pageFoldRight")
                }
                onMouseLeave={() =>
                  handleHoverLeave(`page-${pageNum}`, "pageFoldRight")
                }
              >
                <div className="pageFoldRight"></div>

                {/* content for the front(right) side */}
                <div className="w-100 h-100 d-flex flex-column justify-content-center me-5 h-100">
                  <img
                    src={data.src}
                    alt="illustration"
                    className="user-select-none p-2 mh-100 mw-100"
                  />
                </div>
              </div>

              {/* back page */}
              <div
                className="back pageFace"
                onMouseEnter={() =>
                  handleHoverEnter(`page-${pageNum}`, "pageFoldLeft")
                }
                onMouseLeave={() =>
                  handleHoverLeave(`page-${pageNum}`, "pageFoldLeft")
                }
              >
                <div className="pageFoldLeft"></div>
                {/* content for the back(left) side */}
                <h4 className="mb-3">Page number = {pageNum}</h4>
                <p className="fs-2 lh-lg">{data.content}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* control bar */}
      <div className="row w-100 pb-2">
        {/* progress bar */}
        <div className="p-2 col-11 d-flex align-items-center">
          <input
            type="range"
            min="1"
            max={totalPage}
            value={pageIndex}
            onChange={(e) => goToPage(Number(e.target.value))}
            className="w-100"
          />
        </div>
      </div>

      {/* control tools */}
      <div className="d-flex flex-column position-absolute end-0 bottom-0 p-2">
        {/* Conditionally render the navigation button on the last page */}
        {pageIndex === totalPage && (
          <button
            onClick={navigateToFirstPage}
            className="btn btn-primary-outline"
          >
            <ArrowClockwise color="black" className="fs-3 bolder fw-bolder" />
          </button>
        )}

        {/* overview button */}
        <button
          className="btn btn-primary-outline"
          onClick={() => setIsOverviewOpen(true)}
        >
          <Grid3x3GapFill color="black" className="fs-3" />
        </button>
      </div>

      {/* Overview Modal */}
      {isOverviewOpen && (
        <div className="overview-modal">
          <div className="modal-content">
            <button
              onClick={() => setIsOverviewOpen(false)}
              className="btn btn-primary-outline position-absolute top-0 end-0 rounded-circle"
            >
              <X color="gray" className="fs-1 closs-icon" />
            </button>
            <div className="images-grid pt-4">
              {[...Array(totalPage)].map((_, index) => (
                <img
                  key={index}
                  src={data.src} // Replace with actual source for each page
                  alt={`Page ${index + 1}`}
                  className="overview-image"
                  onClick={() => handleImageClick(index)} // Navigate to the page on click
                />
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default Content;