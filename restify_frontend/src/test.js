
            <button
                className="btn btn-outline-dark"
                type="button"
                aria-expanded="false"
                style={{marginRight: '7pt', display: 'inline-block'}}
                onClick={() => changePage('prev')}
                disabled={currentPage === 1}
            >
                &lt;
            </button>
            <button
                className="btn btn-outline-dark"
                type="button"
                aria-expanded="false"
                style={{display: 'inline-block'}}
                onClick={() => changePage('next')}
                disabled={topics.length < topicPerPage}
            >
                &gt;
            </button>