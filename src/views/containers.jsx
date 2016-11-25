var React = require('react');
var DefaultLayout = require('./layout.jsx');
var ContainerSummary = require('./components/ContainerSummary');

class IndexPage extends React.Component {
    render() {

        let containerSummaries = this.props.containerSummaries.map((summary) => {
            return <ContainerSummary key={summary.id} summary={summary}/>
        });

        return (
            <DefaultLayout title={this.props.title}>
                <div className="container-fluid">
                    <p>
                        <strong>Here are your currently running containers</strong>
                    </p>
                    <div className="flex">
                        {containerSummaries}
                    </div>
                </div>
            </DefaultLayout>
        );
    }
}

module.exports = IndexPage;
