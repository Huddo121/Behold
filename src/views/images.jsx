var React = require('react');
var DefaultLayout = require('./layout.jsx');
var ImageSummary = require('./components/ImageSummary');

class ImagePage extends React.Component {
    render() {

        let imageSummaries = this.props.imageSummaries.map((summary) => {
            return <ImageSummary key={summary.id} summary={summary}/>
        });

        return (
            <DefaultLayout title={this.props.title}>
                <div>
                    <p>
                        <strong>Here, each image lists its containers</strong>
                    </p>
                    <div className="flex two three-600 five-1200 grow">
                        {imageSummaries}
                    </div>
                </div>
            </DefaultLayout>
        );
    }
}

module.exports = ImagePage;
