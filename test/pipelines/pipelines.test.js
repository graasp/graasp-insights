/* eslint-disable no-restricted-syntax */
/* eslint-disable func-names */
import { expect } from 'chai';
import { closeApplication, createApplication } from '../application';
import { DEFAULT_GLOBAL_TIMEOUT } from '../constants';
import {
  PRIMARY_PIPELINE,
  SECONDARY_PIPELINE,
  SECOND_ALGORITHM,
  AUXILIARY_PIPELINE,
  ALGORITHMS_PIPELINES,
} from '../fixtures/pipelines/pipelines';
import { mochaAsync } from '../utils';
import {
  addPipeline,
  clickAddButton,
  addAlgorithmToPipeline,
  clickSavePipelineButton,
  checkPipelineRowLayout,
  clickEditPipelineButton,
  removeAlgorithmPipeline,
  clickDeletePipelineButton,
  getNumberOfPipelines,
  editNamePipeline,
  editDescriptionPipeline,
  clickEditPipelineBackButton,
  checkAlgorithmStillInPipeline,
  checkOrderAlgorithmPipeline,
} from './utils';

describe('Pipelines Scenarios', function () {
  this.timeout(DEFAULT_GLOBAL_TIMEOUT);
  let app = null;

  beforeEach(
    mochaAsync(async () => {
      app = await createApplication({
        database: {
          pipelines: [AUXILIARY_PIPELINE],
          algorithms: ALGORITHMS_PIPELINES,
        },
        responses: { showMessageDialogResponse: 1 },
      });
      const { client } = app;
      await client.goToPipelines();
    }),
  );

  afterEach(() => {
    return closeApplication(app);
  });

  it(
    'Adds, Edits, Deletes a pipeline',
    mochaAsync(async () => {
      const { client } = app;

      const nbrPipelinesPrev = await getNumberOfPipelines(client);

      // add pipeline
      await clickAddButton(client);
      await addPipeline(client, PRIMARY_PIPELINE);

      for (const algo of ALGORITHMS_PIPELINES) {
        await addAlgorithmToPipeline(client, algo);
      }

      await clickSavePipelineButton(client);
      await checkPipelineRowLayout(client, PRIMARY_PIPELINE);

      const nbrPipelinesAfterAdd = await getNumberOfPipelines(client);
      expect(nbrPipelinesAfterAdd - nbrPipelinesPrev).to.be.equal(1);

      // edit pipeline
      await clickEditPipelineButton(client, PRIMARY_PIPELINE);
      await removeAlgorithmPipeline(
        client,
        ALGORITHMS_PIPELINES.findIndex((x) => x.id === SECOND_ALGORITHM.id),
      );
      await editNamePipeline(client, SECONDARY_PIPELINE);
      await editDescriptionPipeline(client, SECONDARY_PIPELINE);

      await clickEditPipelineBackButton(client);
      await clickEditPipelineButton(client, PRIMARY_PIPELINE);
      await checkOrderAlgorithmPipeline(client);
      await checkAlgorithmStillInPipeline(client, SECOND_ALGORITHM);
      await clickEditPipelineBackButton(client);

      await clickEditPipelineButton(client, PRIMARY_PIPELINE);
      await removeAlgorithmPipeline(
        client,
        ALGORITHMS_PIPELINES.findIndex((x) => x.id === SECOND_ALGORITHM.id),
      );
      await editNamePipeline(client, SECONDARY_PIPELINE);
      await editDescriptionPipeline(client, SECONDARY_PIPELINE);

      await clickSavePipelineButton(client);

      const nbrPipelinesAfterEdit = await getNumberOfPipelines(client);
      expect(nbrPipelinesAfterEdit - nbrPipelinesAfterAdd).to.be.equal(0);

      // delete pipeline
      await clickDeletePipelineButton(client, SECONDARY_PIPELINE);
      const nbrPipelinesAfterDelete = await getNumberOfPipelines(client);
      expect(nbrPipelinesAfterDelete - nbrPipelinesAfterEdit).to.be.equal(-1);
    }),
  );
});
