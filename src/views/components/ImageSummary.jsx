var React = require('react');

class ImageSummary extends React.Component {
    render() {

        let spawnedContainers = this.props.summary.containers.map((container) => {
            return (
                <div key={container.id}>
                    Container: <a href={"/containers/" + container.id}>{container.name}</a>
                </div>
            )
        });

        return (
            <div className="card summary">
                <div className="card-block">
                    <strong className="card-title">
                        <a href={"/images/" + this.props.summary.id}>{this.props.summary.name}</a>
                     </strong>
                    <hr/>
                    <p className="card-text">
                        {spawnedContainers}
                    </p>
                </div>
            </div>
        );
    }
}

module.exports = ImageSummary;
