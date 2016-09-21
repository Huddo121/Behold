var React = require('react');
var DefaultLayout = require('./layout.jsx');
var ContainerSummary = require('./components/ContainerSummary');

class IndexPage extends React.Component {
    render() {

        let containerSummaries = this.props.containerSummaries.map((summary) => {
            return <ContainerSummary key={summary.Id} summary={summary}/>
        });

        return (
            <DefaultLayout title={this.props.title}>
                <div>
                    <p>
                        <strong>Here are your currently running containers</strong>
                    </p>
                    <div className="flex two three-600 five-1200 grow">
                        {containerSummaries}
                    </div>
                </div>
            </DefaultLayout>
        );
    }
}

module.exports = IndexPage;
