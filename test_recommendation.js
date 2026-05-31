const base = 'http://localhost:3000/api';

async function req(path, body) {
  const res = await fetch(`${base}${path}`, {
    method: body ? 'POST' : 'GET',
    headers: { 'Content-Type': 'application/json' },
    body: body ? JSON.stringify(body) : undefined
  });
  const json = await res.json();
  return { status: res.status, body: json };
}

(async () => {
  try {
    console.log('Creating plot...');
    const p = await req('/plots', {
      name: 'Parcela Test',
      municipality: 'Montero',
      community: 'Comunidad Test',
      area_hectares: 3,
      soil_type: 'Franco arenoso',
      water_source: 'Pozo'
    });
    console.log('plot response', p);
    const plotId = p.body.plot?.id || p.body.plot?._id || p.body.plotId || (p.body?.data && p.body.data[0] && p.body.data[0].id);

    console.log('Creating crop...');
    const c = await req('/crops', {
      plot_id: plotId,
      crop_name: 'Maíz',
      crop_stage: 'Crecimiento vegetativo',
      sowing_date: '2026-05-30',
      drought_sensitivity: 'Alta'
    });
    console.log('crop response', c);
    const cropId = c.body.crop?.id || c.body.crop?._id || (c.body?.data && c.body.data[0] && c.body.data[0].id);

    console.log('Creating pump...');
    const pu = await req('/pumps', {
      plot_id: plotId,
      pump_type: 'Eléctrica',
      power_kw: 2.5,
      flow_liters_minute: 120,
      cost_kwh: 1.2,
      energy_source: 'Energía eléctrica'
    });
    console.log('pump response', pu);
    const pumpId = pu.body.pump?.id || pu.body.pump?._id || (pu.body?.data && pu.body.data[0] && pu.body.data[0].id);

    console.log('Creating weather...');
    const w = await req('/weather', {
      plot_id: plotId,
      temperature: 34,
      humidity: 35,
      rain_probability: 15,
      wind_speed: 12,
      record_date: '2026-05-30'
    });
    console.log('weather response', w);
    const weatherId = w.body.weather?.id || w.body.weather?._id || (w.body?.data && w.body.data[0] && w.body.data[0].id);

    console.log('Generating recommendation...');
    const r = await req('/recommendations/generate', {
      plot_id: plotId,
      crop_id: cropId,
      pump_id: pumpId,
      weather_id: weatherId,
      soil_moisture_estimated: 25,
      producer_observation: 'El suelo se ve seco'
    });
    console.log('recommendation response', JSON.stringify(r, null, 2));
  } catch (e) {
    console.error('Test script error', e);
    process.exit(1);
  }
})();
