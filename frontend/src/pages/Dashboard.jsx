import React, { useState } from 'react';
import { Droplets, MapPin, CloudRain, Sun, Wind, Leaf, Activity, TrendingDown, Info } from 'lucide-react';
import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer } from 'recharts';

function Dashboard() {
  const [dbCrops, setDbCrops] = useState([]);
  const [dbSoils, setDbSoils] = useState([]);
  const [soilType, setSoilType] = useState('');
  const [landArea, setLandArea] = useState('');
  const [areaUnit, setAreaUnit] = useState('hectares');
  const [crop, setCrop] = useState('');
  const [location, setLocation] = useState(null);
  const [calculating, setCalculating] = useState(false);
  const [result, setResult] = useState(null);

  // Fetch crops and soils from Django when the dashboard loads
  React.useEffect(() => {
    const fetchData = async () => {
      try {
        const token = localStorage.getItem('access_token');
        const headers = {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        };

        const cropRes = await fetch('http://localhost:8000/api/crops/', { headers });
        if (cropRes.ok) setDbCrops(await cropRes.json());

        const soilRes = await fetch('http://localhost:8000/api/soils/', { headers });
        if (soilRes.ok) setDbSoils(await soilRes.json());
      } catch (err) {
        console.error("Failed to fetch data from backend", err);
      }
    };
    fetchData();
  }, []);

  const handleDetectLocation = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setLocation({
            lat: position.coords.latitude.toFixed(4),
            lon: position.coords.longitude.toFixed(4),
            climate: 'Semi-Arid',
            temp: '28°C',
            rainfall: 'Low'
          });
        },
        (error) => {
          alert("Error getting location: " + error.message);
        }
      );
    } else {
      alert("Geolocation is not supported by this browser.");
    }
  };

  const calculateWaterFootprint = async (e) => {
    e.preventDefault();
    setCalculating(true);
    
    try {
      const token = localStorage.getItem('access_token');
      const areaMultiplier = areaUnit === 'hectares' ? Number(landArea) : Number(landArea) * 100;

      const response = await fetch('http://localhost:8000/api/calculations/', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          crop: crop, // This is now the crop ID from the database
          soil_type: soilType, // This is now the soil ID
          land_area: areaMultiplier
        })
      });

      if (response.ok) {
        const data = await response.json();
        setResult({
          // The backend returns total_water_liters!
          totalLiters: data.total_water_liters.toLocaleString(),
          dailyLiters: (data.total_water_liters / 120).toLocaleString(),
          efficiency: 'Optimal' // We can improve this logic later
        });
      } else {
        alert("Failed to calculate. Make sure you are logged in!");
      }
    } catch (err) {
      console.error(err);
      alert("Cannot connect to server.");
    } finally {
      setCalculating(false);
    }
  };

  const chartData = [
    { name: 'Crop Uptake', value: 60, color: '#34d399' },
    { name: 'Evaporation', value: 25, color: '#a3e635' },
    { name: 'Runoff', value: 15, color: '#fbbf24' },
  ];

  return (
    <div className="flex-1 max-w-7xl mx-auto w-full px-4 sm:px-6 lg:px-8 py-8 grid grid-cols-1 lg:grid-cols-12 gap-8 relative z-1">
      {/* Left Column: Input Form */}
      <div className="lg:col-span-7 space-y-6">
        
        {/* Location & Climate Panel */}
        <div className="card-3d animate-enter-3d">
          <section className="card-3d-inner bg-white/70 dark:bg-stone-900/60 backdrop-blur-xl rounded-3xl shadow-[0_8px_30px_rgb(0,0,0,0.1)] dark:shadow-[0_8px_30px_rgb(0,0,0,0.2)] border border-emerald-200 dark:border-emerald-900/20 p-6 relative overflow-hidden transition-colors duration-500">
            <div className="absolute inset-0 bg-gradient-to-br from-emerald-100/50 dark:from-emerald-900/10 to-transparent pointer-events-none transition-colors duration-500"></div>
            <div className="relative">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-lg font-semibold text-stone-800 dark:text-stone-100 flex items-center gap-2 transition-colors duration-500">
                  <MapPin className="w-5 h-5 text-emerald-600 dark:text-stone-400 transition-colors duration-500" />
                  Location & Climate
                </h2>
                {!location && (
                  <button 
                    onClick={handleDetectLocation}
                    className="px-4 py-2 text-sm font-medium text-emerald-900 bg-emerald-200 hover:bg-emerald-300 dark:text-white dark:bg-emerald-600 dark:hover:bg-emerald-500 rounded-lg transition-colors shadow-sm dark:shadow-md hover:shadow flex items-center gap-2"
                  >
                    <MapPin className="w-4 h-4" />
                    Detect Location
                  </button>
                )}
              </div>

              {location ? (
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  <div className="bg-white/60 dark:bg-stone-800/60 p-4 rounded-xl border border-stone-200 dark:border-stone-700/40 hover:scale-105 transition-transform duration-500">
                    <div className="text-xs text-stone-500 dark:text-stone-400 font-medium mb-1 uppercase tracking-wider transition-colors duration-500">Coordinates</div>
                    <div className="text-sm font-semibold text-stone-800 dark:text-stone-100 transition-colors duration-500">{location.lat}, {location.lon}</div>
                  </div>
                  <div className="bg-white/60 dark:bg-stone-800/60 p-4 rounded-xl border border-stone-200 dark:border-stone-700/40 hover:scale-105 transition-transform duration-500">
                    <div className="text-xs text-stone-500 dark:text-stone-400 font-medium mb-1 flex items-center gap-1 uppercase tracking-wider transition-colors duration-500">
                      <Sun className="w-3 h-3 text-amber-500 dark:text-current" /> Climate
                    </div>
                    <div className="text-sm font-semibold text-stone-800 dark:text-stone-100 transition-colors duration-500">{location.climate}</div>
                  </div>
                  <div className="bg-white/60 dark:bg-stone-800/60 p-4 rounded-xl border border-stone-200 dark:border-stone-700/40 hover:scale-105 transition-transform duration-500">
                    <div className="text-xs text-stone-500 dark:text-stone-400 font-medium mb-1 flex items-center gap-1 uppercase tracking-wider transition-colors duration-500">
                      <CloudRain className="w-3 h-3 text-blue-500 dark:text-current" /> Rainfall
                    </div>
                    <div className="text-sm font-semibold text-stone-800 dark:text-stone-100 transition-colors duration-500">{location.rainfall}</div>
                  </div>
                  <div className="bg-white/60 dark:bg-stone-800/60 p-4 rounded-xl border border-stone-200 dark:border-stone-700/40 hover:scale-105 transition-transform duration-500">
                    <div className="text-xs text-stone-500 dark:text-stone-400 font-medium mb-1 flex items-center gap-1 uppercase tracking-wider transition-colors duration-500">
                      <Wind className="w-3 h-3 text-stone-400 dark:text-current" /> Temp
                    </div>
                    <div className="text-sm font-semibold text-stone-800 dark:text-stone-100 transition-colors duration-500">{location.temp}</div>
                  </div>
                </div>
              ) : (
                <div className="text-center py-8 bg-white/40 dark:bg-stone-800/40 rounded-xl border border-dashed border-emerald-300 dark:border-stone-700/40 transition-colors duration-500">
                  <p className="text-sm text-stone-500 dark:text-stone-400 transition-colors duration-500">Detect your location to analyze local climate data for accurate water estimation.</p>
                </div>
              )}
            </div>
          </section>
        </div>

        {/* Calculator Form */}
        <div className="card-3d animate-enter-3d-delay">
          <section className="card-3d-inner bg-white/70 dark:bg-stone-900/60 backdrop-blur-xl rounded-3xl shadow-[0_8px_30px_rgb(0,0,0,0.1)] dark:shadow-[0_8px_30px_rgb(0,0,0,0.2)] border border-emerald-200 dark:border-emerald-900/20 p-6 relative overflow-hidden transition-colors duration-500">
            <div className="absolute inset-0 bg-gradient-to-br from-emerald-100/50 dark:from-emerald-900/5 to-transparent pointer-events-none transition-colors duration-500"></div>
            <div className="relative">
              <h2 className="text-lg font-semibold text-stone-800 dark:text-stone-100 flex items-center gap-2 mb-6 transition-colors duration-500">
                <Leaf className="w-5 h-5 text-emerald-600 dark:text-emerald-400 transition-colors duration-500" />
                Crop & Soil Parameters
              </h2>
              
              <form onSubmit={calculateWaterFootprint} className="space-y-5">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                  <div className="space-y-2">
                    <label htmlFor="crop" className="block text-sm font-medium text-stone-700 dark:text-stone-300 transition-colors duration-500">Crop Type</label>
                    <select 
                      id="crop"
                      required
                      value={crop}
                      onChange={(e) => setCrop(e.target.value)}
                      className="w-full px-4 py-2.5 bg-white/60 dark:bg-stone-800/60 border border-stone-200 dark:border-stone-700/60 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 outline-none transition-all text-stone-800 dark:text-stone-100 backdrop-blur-sm"
                    >
                      <option value="" disabled>Select crop...</option>
                      {dbCrops.map((c) => (
                        <option key={c.id} value={c.id}>{c.name}</option>
                      ))}
                    </select>
                  </div>

                  <div className="space-y-2">
                    <label htmlFor="soil" className="block text-sm font-medium text-stone-700 dark:text-stone-300 transition-colors duration-500">Soil Type</label>
                    <select 
                      id="soil"
                      required
                      value={soilType}
                      onChange={(e) => setSoilType(e.target.value)}
                      className="w-full px-4 py-2.5 bg-white/60 dark:bg-stone-800/60 border border-stone-200 dark:border-stone-700/60 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 outline-none transition-all text-stone-800 dark:text-stone-100 backdrop-blur-sm"
                    >
                      <option value="" disabled>Select soil type...</option>
                      {dbSoils.map((s) => (
                        <option key={s.id} value={s.id}>{s.name}</option>
                      ))}
                    </select>
                  </div>
                </div>

                <div className="space-y-2">
                  <label htmlFor="area" className="block text-sm font-medium text-stone-700 dark:text-stone-300 transition-colors duration-500">Land Area</label>
                  <div className="flex rounded-xl shadow-sm">
                    <input
                      type="number"
                      id="area"
                      required
                      min="0.1"
                      step="0.1"
                      value={landArea}
                      onChange={(e) => setLandArea(e.target.value)}
                      className="flex-1 px-4 py-2.5 bg-white/60 dark:bg-stone-800/60 border border-stone-200 dark:border-stone-700/60 rounded-l-xl focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 outline-none transition-all border-r-0 text-stone-800 dark:text-stone-100 placeholder:text-stone-400 dark:placeholder:text-stone-500 backdrop-blur-sm"
                      placeholder="Enter area..."
                    />
                    <select
                      value={areaUnit}
                      onChange={(e) => setAreaUnit(e.target.value)}
                      className="px-4 py-2.5 bg-emerald-50 dark:bg-stone-700/60 border border-emerald-100 dark:border-stone-700/60 rounded-r-xl text-sm font-medium text-emerald-800 dark:text-stone-300 outline-none focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 transition-colors duration-500"
                    >
                      <option value="hectares">Hectares</option>
                      <option value="sqkm">km²</option>
                    </select>
                  </div>
                </div>

                <button 
                  type="submit"
                  disabled={calculating || !location}
                  className="w-full mt-4 bg-emerald-600 hover:bg-emerald-500 disabled:bg-stone-300 dark:disabled:bg-stone-700 disabled:cursor-not-allowed text-white font-medium py-3 px-4 rounded-xl transition-colors flex items-center justify-center gap-2 shadow-md"
                >
                  {calculating ? (
                    <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  ) : (
                    <Droplets className="w-5 h-5" />
                  )}
                  {calculating ? 'Analyzing data...' : 'Calculate Water Footprint'}
                </button>
                
                {!location && (
                  <p className="text-xs text-center text-stone-500 dark:text-stone-500 mt-2 transition-colors duration-500">
                    *Please detect your location first to enable accurate climate-based calculations.
                  </p>
                )}
              </form>
            </div>
          </section>
        </div>
      </div>

      {/* Right Column: Results Dashboard */}
      <div className="lg:col-span-5">
        <div className="card-3d animate-enter-3d-delay-2">
          <section className="card-3d-inner bg-white/80 dark:bg-stone-950/80 backdrop-blur-xl rounded-3xl shadow-xl dark:shadow-2xl border border-emerald-200 dark:border-stone-800/60 p-8 text-stone-800 dark:text-white h-full sticky top-24 overflow-hidden relative transition-colors duration-500">
            {/* Decorative background element */}
            <div className="absolute top-0 right-0 -mr-16 -mt-16 w-64 h-64 bg-emerald-400/20 dark:bg-emerald-500/10 rounded-full blur-3xl pointer-events-none transition-colors duration-500"></div>

            <h2 className="text-xl font-semibold mb-8 flex items-center gap-3 relative z-10">
              <div className="p-2 bg-emerald-100 dark:bg-stone-800/50 rounded-lg transition-colors duration-500">
                <Activity className="w-5 h-5 text-emerald-600 dark:text-emerald-400 transition-colors duration-500" />
              </div>
              Comprehensive Analysis
            </h2>
            
            {result ? (
              <div className="space-y-8 relative z-10">
                
                {/* Primary Metric */}
                <div className="bg-white/60 dark:bg-stone-900/70 rounded-2xl p-6 border border-emerald-100 dark:border-stone-800/50 shadow-sm dark:shadow-inner transition-colors duration-500">
                  <div className="flex justify-between items-start mb-2">
                    <div className="text-emerald-700 dark:text-emerald-300 text-xs font-bold tracking-widest uppercase transition-colors duration-500">Total Estimated Water</div>
                    <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-medium bg-emerald-100 dark:bg-emerald-500/10 text-emerald-700 dark:text-emerald-400 border border-emerald-200 dark:border-emerald-500/20 transition-colors duration-500">
                      <TrendingDown className="w-3 h-3" /> 12% vs Avg
                    </span>
                  </div>
                  <div className="flex items-baseline gap-2">
                    <span className="text-5xl font-black tracking-tighter text-transparent bg-clip-text bg-gradient-to-r from-emerald-600 to-lime-500 dark:from-emerald-300 dark:to-lime-300 transition-colors duration-500">
                      {result.totalLiters}
                    </span>
                    <span className="text-stone-500 dark:text-stone-400 font-medium transition-colors duration-500">Liters / Cycle</span>
                  </div>
                  
                  {/* Visual Chart */}
                  <div className="mt-6">
                    <div className="flex justify-between text-xs text-stone-500 dark:text-stone-400 mb-2 font-medium transition-colors duration-500">
                      <span>Usage Breakdown</span>
                      <span>100%</span>
                    </div>
                    <div className="h-40 w-full relative -left-4">
                      <ResponsiveContainer width="100%" height="100%">
                        <PieChart>
                          <Pie
                            data={chartData}
                            cx="50%"
                            cy="50%"
                            innerRadius={45}
                            outerRadius={65}
                            paddingAngle={3}
                            dataKey="value"
                            stroke="none"
                          >
                            {chartData.map((entry, index) => (
                              <Cell key={`cell-${index}`} fill={entry.color} />
                            ))}
                          </Pie>
                          <Tooltip 
                            contentStyle={{ backgroundColor: '#1c1917', border: '1px solid #44403c', borderRadius: '0.75rem', color: '#e7e5e4', fontSize: '12px', padding: '8px 12px' }}
                            itemStyle={{ color: '#e7e5e4' }}
                            formatter={(value) => `${value}%`}
                          />
                        </PieChart>
                      </ResponsiveContainer>
                    </div>
                    <div className="flex gap-4 justify-center mt-0 text-[10px] uppercase font-bold tracking-wider text-stone-600 dark:text-stone-500 transition-colors duration-500">
                      <div className="flex items-center gap-1.5"><span className="w-2 h-2 rounded-full bg-emerald-400"></span> Uptake</div>
                      <div className="flex items-center gap-1.5"><span className="w-2 h-2 rounded-full bg-lime-400"></span> Evaporation</div>
                      <div className="flex items-center gap-1.5"><span className="w-2 h-2 rounded-full bg-amber-400"></span> Runoff</div>
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="bg-white/60 dark:bg-stone-800/40 rounded-2xl p-5 border border-emerald-100 dark:border-stone-700/40 hover:scale-105 transition-transform duration-500">
                    <div className="text-stone-500 dark:text-stone-400 text-xs font-medium mb-2 uppercase tracking-wide transition-colors duration-500">Daily Requirement</div>
                    <div className="text-2xl font-bold">{result.dailyLiters} <span className="text-sm text-stone-400 dark:text-stone-500 font-normal transition-colors duration-500">L/day</span></div>
                  </div>
                  <div className="bg-white/60 dark:bg-stone-800/40 rounded-2xl p-5 border border-emerald-100 dark:border-stone-700/40 hover:scale-105 transition-transform duration-500">
                    <div className="text-stone-500 dark:text-stone-400 text-xs font-medium mb-2 uppercase tracking-wide transition-colors duration-500">Soil Retention</div>
                    <div className="text-2xl font-bold flex items-center gap-2">
                      {result.efficiency}
                      {result.efficiency === 'Low' && <span className="flex w-3 h-3 rounded-full bg-amber-400 shadow-[0_0_10px_rgba(251,191,36,0.5)]" />}
                      {result.efficiency === 'Optimal' && <span className="flex w-3 h-3 rounded-full bg-emerald-400 shadow-[0_0_10px_rgba(52,211,153,0.5)]" />}
                    </div>
                  </div>
                </div>

                <div className="mt-8 bg-emerald-50 dark:bg-emerald-900/20 p-5 rounded-2xl border border-emerald-200 dark:border-emerald-500/20 flex gap-4 transition-colors duration-500">
                  <div className="shrink-0 mt-1">
                    <Info className="w-5 h-5 text-emerald-600 dark:text-emerald-400 transition-colors duration-500" />
                  </div>
                  <p className="text-sm text-stone-700 dark:text-stone-300 leading-relaxed transition-colors duration-500">
                    Based on your <strong className="text-stone-900 dark:text-white transition-colors duration-500">{location.climate}</strong> climate and <strong className="text-stone-900 dark:text-white transition-colors duration-500">{soilType}</strong> soil profile, we recommend implementing drip irrigation to improve water efficiency by up to 30%.
                  </p>
                </div>

              </div>
            ) : (
              <div className="flex flex-col items-center justify-center h-[400px] text-stone-400 dark:opacity-60 relative z-10 transition-colors duration-500">
                <div className="relative animate-droplet-3d">
                  <Droplets className="w-20 h-20 mb-6 stroke-1 text-emerald-300 dark:text-stone-500 transition-colors duration-500" />
                  <div className="absolute inset-0 bg-emerald-400/20 blur-2xl rounded-full"></div>
                </div>
                <p className="text-center text-sm max-w-[250px] leading-relaxed">
                  Enter your parameters and calculate to see your detailed water footprint analysis here.
                </p>
              </div>
            )}
          </section>
        </div>
      </div>
    </div>
  );
}

export default Dashboard;
