var React = require('react');

class ImageSummary extends React.Component {
    render() {

        let spawnedContainers = this.props.summary.containers.map((container) => {
            return (
                <div key={container} className="stack">
                    Container: {container}
                </div>
            )
        });

        return (
            <div style={{width: 'fit-content'}}>
                <article className="card">
                    <header className="flex">
                        <strong><span>{this.props.summary.id}</span></strong>
                    </header>
                    <footer>
                        {spawnedContainers}
                    </footer>
                </article>
            </div>
        );
    }
}

module.exports = ImageSummary;
