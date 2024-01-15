import React from "react";

const NewsItem = (props) =>{
    let { title, description, imageUrl, newsUrl, author, date, source } =props;
    return (
      <div className="my-3">
        <div className="card">
        <span className="position-absolute top-0 translate-middle badge rounded-pill bg-success" style={{left : '50%', zIndex:'1'}}>
              {source}
            </span>
          <img
            src={
              !imageUrl
                ? "https://static.toiimg.com/thumb/imgsize-37494,msid-101650517,width-400,resizemode-4/101650517.jpg"
                : imageUrl
            }
            className="card-img-top"
            alt="..."
          />
          <div className="card-body">
            <h6 className="card-title">{title}...</h6>
            <p className="card-text">{description}</p>
            <p className="card-text">
              <small className="text-muted">
                By {!author ? "Unknown" : author} on{" "}
                {new Date(date).toGMTString()}
              </small>
            </p>
            <a
              href={newsUrl}
              className="btn btn-primary btn-sm"
              target="_blank"
              rel="noreferrer"
            >
              Read More
            </a>
          </div>
        </div>
      </div>
    );
}
export default NewsItem;
