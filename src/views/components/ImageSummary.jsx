var React = require('react');

class ImageSummary extends React.Component {
    render() {

        let spawnedContainers = this.props.summary.containers.map((container) => {
            return (
                <div key={container.id} className="stack">
                    Container: <a href={"/containers/" + container.id}>{container.name}</a>
                </div>
            )
        });

        return (
            <div style={{width: 'fit-content'}}>
                <article className="card">
                    <header className="flex">
                        <strong><span>{this.props.summary.name}</span></strong>
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
