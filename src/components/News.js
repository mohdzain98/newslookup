import React, {useEffect, useState} from "react";
import NewsItem from "./NewsItem";
import Spinner from "./Spinner";
import PropTypes from "prop-types";
import InfiniteScroll from "react-infinite-scroll-component";

const News = (props) => {
    const[articles, setArticles] = useState([])
    const[loading, setLoading] = useState(false)
    const[page, setPage] = useState(1)
    const[totalResults, settotalResults] = useState(0)


  const capitalize = (word) => {
    let nword = word.toLowerCase();
    return nword.charAt(0).toUpperCase() + nword.slice(1);
  };
  const getTag = async (articles) =>{
    const urlTwo = "http://127.0.0.1:5000/analysis"
    articles.map( async (element,index)=>{
      let resp = await fetch(urlTwo,{
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        }, 
        body: JSON.stringify({"title": element.title})
      })
      let response = await resp.json()
      articles[index].tag=response.result
      console.log(articles[index].title +""+response.result)
      return response.result

    })
  }
  const updateNews = async () =>{
    props.setProgress(10);
    const url = `https://newsapi.org/v2/top-headlines?country=${props.country}&category=${props.category}&apiKey=${props.apiKey}&page=${page}&pageSize=${props.pageSize}`;
    setLoading(true)
    let data = await fetch(url);
    props.setProgress(30);
    let parsedData = await data.json();
    let tagArticles = await getTag(parsedData.articles)
    props.setProgress(60);
    setArticles(parsedData.articles)
    settotalResults(parsedData.totalResults)
    setLoading(false)
    props.setProgress(100);
  }
  useEffect(() =>{
    document.title = `${capitalize(props.category)} NewsLookup`;
    updateNews();
    // eslint-disable-next-line
  },[])
//   handlePreClick = async () => {
//     this.setState({
//       page: this.state.page - 1,
//     });
//     this.updateNews();
//   };
//   handleNextClick = async () => {
//     this.setState({
//       page: this.state.page + 1,
//     });
//     this.updateNews();
//   };
  const fetchMoreData = async () =>{
    const url = `https://newsapi.org/v2/top-headlines?country=${props.country}&category=${props.category}&apiKey=${props.apiKey}&page=${page+1}&pageSize=${props.pageSize}`;
    setPage(page+1)
    let data = await fetch(url);
    let parsedData = await data.json();
    let tagArticles = await getTag(parsedData.articles)
    setArticles(articles.concat(parsedData.articles))
    settotalResults(parsedData.totalResults)
  }
    return (
      <>
        <div className="container" style={{marginTop:'100px'}}>
            <h1 className="text-center">{`NewsLookup Top ${capitalize(
            props.category
            )} Headlines`}</h1>
        <hr className="hr hr-blurry" />
        </div>
        {loading && <Spinner/>}
        <InfiniteScroll
          dataLength={articles.length}
          next={fetchMoreData}
          hasMore={totalResults - articles.length > props.pageSize}
          loader={<Spinner/>}
        >
        <div className="container my-4"> 
          <div className="row">
            {articles.map((element,index) => {
              return (
                <div className="col-md-4" key={index}>
                  <NewsItem
                    title={element.title ? element.title : ""}
                    description={element.description ? element.description : ""}
                    imageUrl={element.urlToImage}
                    newsUrl={element.url}
                    author={element.author}
                    date={element.publishedAt}
                    source={element.source.name}
                    tag={element.tag}
                  />
                </div>
              );
            })}
          </div>
          </div>
        </InfiniteScroll>
      </>
    );
}
News.defaultProps = {
    country: "in",
    pageSize: 6,
    category:"top"
}
News.propTypes = {
    country: PropTypes.string,
    pageSize: PropTypes.number,
    category: PropTypes.string,
};
export default News;
