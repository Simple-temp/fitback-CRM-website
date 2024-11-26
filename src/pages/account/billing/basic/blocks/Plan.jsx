const Plan = () => {
  const statistics = [{
    total: '$769.00',
    description: 'Annual Total'
  }, {
    total: '$69.00',
    description: 'Next Bill Amount'
  }, {
    total: '23 Aug, 24',
    description: 'Next Billing Date'
  }];
  const renderItem = (statistic, index) => {
    return <div key={index} className="grid grid-cols-1 content-between gap-1.5 border border-dashed border-gray-400 shrink-0 rounded-md px-3.5 py-2 min-w-24 max-w-auto">
        <span className="text-gray-900 text-md leading-none font-medium">{statistic.total}</span>
        <span className="text-gray-700 text-2sm">{statistic.description}</span>
      </div>;
  };
  return <div className="card">
      <div className="card-body lg:py-7.5">
        <div className="flex flex-col items-stretch gap-5 lg:gap-7.5">
          <div className="flex flex-wrap items-center gap-5 justify-between">
            <div className="flex flex-col gap-1">
              <div className="flex items-center gap-2.5">
                <h2 className="text-2xl font-semibold text-gray-900">Basic Plan</h2>
                <span className="badge badge-sm badge-success badge-outline">Monthly</span>
              </div>
              <p className="text-2sm text-gray-700">
                Essential Features for Startups and Individuals
              </p>
            </div>
            <div className="flex gap-2.5">
              <a href="#" className="btn btn-sm btn-light">
                Cancel Plan
              </a>
              <a href="#" className="btn btn-sm btn-primary">
                Upgrade Plan
              </a>
            </div>
          </div>

          <div className="flex items-center flex-wrap gap-2 lg:gap-5">
            {statistics.map((statistic, index) => {
            return renderItem(statistic, index);
          })}
          </div>

          <div className="flex flex-col gap-3.5">
            <span className="text-2sm text-gray-700">Usage (32 of 40 users)</span>
            <div className="progress progress-primary">
              <div className="progress-bar" style={{
              width: '80%'
            }}></div>
            </div>
          </div>
        </div>
      </div>
    </div>;
};
export { Plan };