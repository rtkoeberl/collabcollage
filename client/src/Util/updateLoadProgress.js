export default function updateLoadProgress(artists) {

  // pull page load data
  let nextIndex;
  let pageStats = artists.map(a => [a.page, a.pages]);
  let percentLoaded = pageStats.map(a => ((Math.round(a[0] / a[1] * 100) / 100)));
  // console.log(percentLoaded)

  // calculate total progress for search
  let totalLoaded = pageStats.reduce((a, b) => ([a[0] + b[0], a[1] + b[1]]), [0, 0]);

  // determine the index of the next artist to be pulled
  if (percentLoaded.length === percentLoaded.filter(p => p === 1).length) {
    nextIndex = null;
  } else {
    nextIndex = percentLoaded.reduce((iMin, x, i, arr) => x < arr[iMin] ? i : iMin, 0);
  }
  
  return {
    totalLoaded,
    nextIndex
  };
}