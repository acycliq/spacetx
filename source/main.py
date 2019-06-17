from source.systemData import Cells
from systemData import Spots
from utils import loadmat
from singleCell import geneSet
import source.config as config
import starfish as sf
import xarray as xr
import os
import logging

dir_path = os.path.dirname(os.path.realpath(__file__))


logger = logging.getLogger()
logging.basicConfig(
    level=logging.DEBUG,
    format="%(asctime)s:%(levelname)s:%(message)s"
    )


roi = config.DEFAULT['roi']

label_image_path = config.DEFAULT['label_image']
print("reading CellMap from %s" % label_image_path)
label_image = loadmat(os.path.join(label_image_path))
label_image = label_image["CellMap"]

saFile = "../data_preprocessed/spot_attributes.nc"



cells = Cells(label_image, config.DEFAULT)
c = cells.collection[0]


logger.info('********* Getting spotattributes from %s **********', saFile)
sa = sf.types.SpotAttributes(xr.open_dataset(saFile).to_dataframe())

spots = Spots(sa.data)
geneUniv = spots.geneUniv()
geneSet(geneUniv, config.DEFAULT)

spots.collection[0].closestCell(cells.coords())
spots.closestCell(cells.coords())
spots.myClosest(cells.nn())


print('Done')

