var React = require('react');
var DefaultLayout = require('./layout');

class ErrorPage extends React.Component {
    render() {
        let error = this.props.error || {};
        let elements = [];
        elements.push(<h1 key="message">{this.props.message}</h1>);

        if(error.status) {
            elements.push(<h2 key="status">{error.status}</h2>);
        }

        if(error.stack) {
            elements.push(<pre key="stack">{error.stack}</pre>)
        }

        return (
            <DefaultLayout>
                {elements}
            </DefaultLayout>
        );
    }
}

module.exports = ErrorPage;
