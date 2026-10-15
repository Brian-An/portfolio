import coordinates from '@/constants/portrait-dots.json';

export const portraitDotGroups = Array.from({ length: 32 }, (_, shade) => {
  const darkness = shade / 31;
  return {
    radius: .65 + darkness * 1.65,
    alpha: .2 + darkness * .8,
    dots: coordinates.filter(([, , value]) => value === shade).map(([column, row]) => ({
      x: column * 5 + 2.5,
      y: row * 5 + 2.5,
      distance: 90 + ((column * 17 + row * 31) % 60),
      curve: ((column * 7 + row * 13) % 32) - 16,
    })),
  };
});
