import { once, on,  showUI } from '@create-figma-plugin/utilities'
import { FixPathHandler, CloseHandler } from './types'

export default function () {
  on<FixPathHandler>('FIX_PATH', (roundingUnit: number) => {
    const selectedNodes = figma.currentPage.selection;
    let numVectorPaths = 0;

    for (const node of selectedNodes) {
      if (node.type === 'VECTOR' && node.vectorPaths.length > 0) {
        numVectorPaths += node.vectorPaths.length;
        const roundedVectorPaths = node.vectorPaths.map((vectorPath) => {
          return {
            windingRule: vectorPath.windingRule,
            data: vectorPath.data.replace(/(\d+\.\d+)/g, (match) => {
              return String(Math.round(parseFloat(match) / roundingUnit) * roundingUnit);
            }),
          };
        });
        node.vectorPaths = roundedVectorPaths;
        console.log('Rounded vector paths:', roundedVectorPaths);
      }
    }

    figma.currentPage.selection = selectedNodes;
    figma.viewport.scrollAndZoomIntoView(selectedNodes);
    figma.ui.postMessage({ type: 'update-ui', numVectorPaths, roundingUnit });
    // figma.closePlugin();
  });

  once<CloseHandler>('CLOSE', () => {
    figma.closePlugin();
  });

  showUI({
    height: 140,
    width: 220,
  });
}
