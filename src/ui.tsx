import {
  Button,
  Columns,
  Container,
  Muted,
  render,
  Text,
  TextboxNumeric,
  VerticalSpace,
} from '@create-figma-plugin/ui'
import { emit } from '@create-figma-plugin/utilities'
import { h } from 'preact'
import { useCallback, useState } from 'preact/hooks'

import { FixPathHandler, CloseHandler } from './types'

function Plugin() {
  const [roundingUnit, setRoundingUnit] = useState<number | null>(0.1);
  const [roundingUnitString, setRoundingUnitString] = useState('0.1');
  const [numVectorPaths, setNumVectorPaths] = useState<number | null>(null);
  const [isFixingPaths, setIsFixingPaths] = useState(false);

  const handleFixPathButtonClick = useCallback(() => {
    if (roundingUnit !== null && !isFixingPaths) {
      setIsFixingPaths(true);
      emit<FixPathHandler>('FIX_PATH', roundingUnit);
    }
  }, [roundingUnit, isFixingPaths]);

  const handleCloseButtonClick = useCallback(() => {
    emit<CloseHandler>('CLOSE')
  }, [])

  window.onmessage = (event) => {
    const { type, numVectorPaths, roundingUnit } = event.data.pluginMessage;
    if (type === 'update-ui') {
      setNumVectorPaths(numVectorPaths);
      setRoundingUnit(roundingUnit);
      setRoundingUnitString(roundingUnit.toString());
      setIsFixingPaths(false); // Reset the isFixingPaths state
    }
  };

  return (
    <Container space="medium">
      <VerticalSpace space="large" />
      <Text>
        <Muted>Rounding Unit (decimal places)</Muted>
      </Text>
      <VerticalSpace space="small" />
      <TextboxNumeric
        onNumericValueInput={setRoundingUnit}
        onValueInput={setRoundingUnitString}
        value={roundingUnitString}
        variant="border"
      />
      <VerticalSpace space="extraLarge" />
      <Columns space="extraSmall">
        <Button fullWidth onClick={handleFixPathButtonClick}>
          Round Vector Paths
        </Button>
        <Button fullWidth onClick={handleCloseButtonClick} secondary>
          Close
        </Button>
      </Columns>
      <VerticalSpace space="small" />
    </Container>
  )
}

export default render(Plugin)
