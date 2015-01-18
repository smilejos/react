var data = [
  {author: "Pete Hunt", text: "This is one comment"},
  {author: "Jordan Walke", text: "This is *another* comment"}
];

var Comment = React.createClass({
  render: function() {
    return (
      <div className="comment">
        <h2 className="commentAuthor">
          {this.props.author}
        </h2>
        {this.props.text}
      </div>
    );
  }
});
 
var CommentList = React.createClass({
  render: function() {
    var commentNodes = this.props.data.map(function (comment) {
        return <Comment author={comment.author} text={comment.text}></Comment>;
    });
    return (
        <div className="commentList">
         {commentNodes}
        </div>
    );
  }
});

var CommentForm = React.createClass({
    handleSubmit: function() {
        var author = this.refs.author.getDOMNode().value.trim();
        var text = this.refs.text.getDOMNode().value.trim();
        this.props.onCommentSubmit({author: author, text: text});
        //this.refs.author.getDOMNode().value = '';
        this.refs.text.getDOMNode().value = '';
        return false;
    },
    render: function() {
        return (
            <div className="commentForm">
                <input type="text" placeholder="Your name" ref="author"/>
                <input type="text" placeholder="Say something..." ref="text" />
                <input type="button" value="Post" onClick={this.handleSubmit}/>
            </div>
        );
    }
});

var CommentBox = React.createClass({
    receiveComment: function(comment) {
        var comments = this.state.data;
        var newComments = comments.concat([comment]);
        this.setState({data: newComments});
    },
    handleCommentSubmit: function(comment) {
        socket.emit('sendComment', comment);
    },
    getInitialState: function() {
        socket.on('receiveComment', this.receiveComment);
        return {data: []};
    },
    render: function() {
        return (
          <div className="commentBox">
            <h1>Comments</h1>
            <CommentList data={this.state.data} />
            <CommentForm onCommentSubmit={this.handleCommentSubmit}/>
          </div>
        );
    }
});

React.renderComponent(
  <CommentBox/>,
  document.getElementById('content')
);