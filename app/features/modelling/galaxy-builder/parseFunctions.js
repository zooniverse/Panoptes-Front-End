export const hasComp = c => (c.value[0].value.length > 0);

export const parseDisk = (comp, state) => {
  if (!hasComp(comp)) return null;
  const disk = Object.assign(
    { name: state.model.disk.name },
    state.model.disk.default,
    {
      mux: state.sizeMultiplier * parseFloat(comp.value[0].value[0].x),
      muy: state.sizeMultiplier * (state.size[1] - parseFloat(comp.value[0].value[0].y)),
      rx: state.sizeMultiplier * parseFloat(comp.value[0].value[0].rx),
      ry: state.sizeMultiplier * parseFloat(comp.value[0].value[0].ry),
      roll: parseFloat(comp.value[0].value[0].angle),
      scale: parseFloat(comp.value[1].value),
      i0: parseFloat(comp.value[2].value)
    }
  );
  return ([
    state.model.disk.func,
    disk
  ]);
};

export const parseBulge = (comp, state) => {
  if (!hasComp(comp)) return null;
  const bulge = Object.assign(
    { name: state.model.bulge.name },
    state.model.bulge.default,
    {
      mux: state.sizeMultiplier * parseFloat(comp.value[0].value[0].x),
      muy: state.sizeMultiplier * (state.size[1] - parseFloat(comp.value[0].value[0].y)),
      rx: state.sizeMultiplier * parseFloat(comp.value[0].value[0].rx),
      ry: state.sizeMultiplier * parseFloat(comp.value[0].value[0].ry),
      roll: parseFloat(comp.value[0].value[0].angle),
      scale: parseFloat(comp.value[1].value),
      i0: parseFloat(comp.value[2].value),
      n: parseFloat(comp.value[3].value)
    }
  );
  return ([
    state.model.bulge.func,
    bulge
  ]);
};

export const parseBar = (comp, state) => {
  if (!hasComp(comp)) return null;
  const drawnComp = comp.value[0].value[0];
  const bar = Object.assign(
    { name: state.model.bar.name },
    state.model.bar.default,
    {
      name: state.model.bar.name,
      mux: state.sizeMultiplier * parseFloat(drawnComp.x + (drawnComp.width / 2.0)),
      muy: state.sizeMultiplier * (state.size[1] - ((
        drawnComp.y + (drawnComp.height / 2.0)
      ))),
      rx: state.sizeMultiplier * parseFloat(drawnComp.width),
      ry: state.sizeMultiplier * parseFloat(drawnComp.height),
      roll: parseFloat(-drawnComp.angle),
      scale: parseFloat(comp.value[1].value),
      i0: parseFloat(comp.value[2].value),
      n: parseFloat(comp.value[3].value),
      c: parseFloat(comp.value[4].value)
    }
  );
  return ([
    state.model.bar.func,
    bar
  ]);
};

export const parseSpiralArms = (comp, state, currentComps) => {
  // has a spiral been drawn?
  if (!hasComp(comp)) return [];
  // do we have a disk?
  const disks = currentComps.filter(i => i[1].name === 'disk');
  if (disks.length === 0) return [];
  const ret = comp.value[0].value.map(
    drawnComponent => [
      state.model.spiral.func,
      Object.assign(
        { name: state.model.spiral.name },
        state.model.spiral.default,
        {
          disk: Object.assign({}, disks[0][1]), // base falloff from the 0th disk
          i0: parseFloat(drawnComponent.details[0].value),
          spread: parseFloat(drawnComponent.details[1].value),
          falloff: parseFloat(comp.value[1].value),
          points: drawnComponent.points.map(
            p => [state.sizeMultiplier * p.x, state.sizeMultiplier * (state.size[0] - p.y)]
          )
        }
      )
    ]
  );
  return ret;
};
